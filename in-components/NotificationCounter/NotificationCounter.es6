import Immutable from 'immutable';
import React from 'react/addons';

import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import {getIssueCountSummary} from 'in-services/issueTracker';
import {health} from 'in-services/health';
import {theme} from 'in-services/theme';

import './NotificationCounter.less';

const block = 'in-notification-counter';

const NotificationCounter = React.createClass({
  mixins: [
    SubscriptionMixin
  ],

  propTypes: {
    onClick: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      issueSummary: Immutable.Map({
        [health.ok]: 0,
        [health.warning]: 0,
        [health.danger]: 0
      })
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

    return (
      <div className={block}
           style={{background: color}}
           onClick={this.props.onClick}>
        {errorAndWarningCounts}
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
  }
});

export default NotificationCounter;
