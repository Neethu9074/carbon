import Immutable from 'immutable';
import React from 'react/addons';

import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import {getIssueCountSummary} from 'in-services/issueTracker';
import {health} from 'in-services/health';
import {theme} from 'in-services/theme';

import NotificationCenter from '../NotificationCenter';

import './NotificationCounter.less';

const block = 'in-notification-counter';

const NotificationCounter = React.createClass({
  mixins: [
    SubscriptionMixin
  ],

  propTypes: {
    className: React.PropTypes.string
  },

  getInitialState() {
    return {
      issueSummary: Immutable.Map({
        [health.ok]: 0,
        [health.warning]: 0,
        [health.danger]: 0
      }),
      showNotificationCenter: false
    };
  },

  componentDidMount() {
    this.addSubscription(
      getIssueCountSummary().subscribe(issueSummary => this.setState({issueSummary}))
    );
  },

  render() {
    const summary = this.state.issueSummary;
    const errorAndWarningCounts = summary.get(health.warning) + summary.get(health.danger);
    const color = this.getColor(summary);
    const showNC = this.state.showNotificationCenter;

    return (
      <div className={this.props.className}>
        <div className={block}
             style={{background: color}}
             onClick={this.toggleNotificationCenter}>
          {errorAndWarningCounts}
        </div>

        {showNC ?
          <div className={block + '__notification-center'}>
            <NotificationCenter toggleNotificationCenter={this.toggleNotificationCenter}
                                open={showNC}/>
          </div>
        : null}
      </div>
    );
  },

  getColor(summary) {
    if (summary.get(health.danger) > 0) {
      return theme.health[10];
    } else if (summary.get(health.warning) > 0) {
      return theme.health[5];
    }

    return theme.health[0];
  },

  toggleNotificationCenter() {
    this.setState({ showNotificationCenter: !this.state.showNotificationCenter });
  }
});

export default NotificationCounter;
