import React from 'react/addons';
import Immutable from 'immutable';

import {getIssueCountSummary} from 'in-services/issueTracker';
import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import {health} from 'in-services/health';
import {theme} from 'in-services/theme';

import './Issues.less';

const block = 'in-issue-count';

const Issues = React.createClass({
  mixins: [
    React.addons.PureRenderMixin,
    SubscriptionMixin
  ],

  propTypes: {
    onIssuesClicked: React.PropTypes.func
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
    const errorAndWarningCounts = summary.get(health.warning) +
      summary.get(health.danger);

    const color = this.getColor();
    return (
      <div className={block}
           style={{color: color, borderColor: color}}
           onClick={this.props.onIssuesClicked}>
        <div className={block + '__count'}>
          {errorAndWarningCounts}
        </div>
      </div>
    );
  },

  hasWarningOrDangerSeverity() {
    const summary = this.state.issueSummary;
    return summary.get(health.warning) > 0 || summary.get(health.danger) > 0;
  },

  getColor() {
    const summary = this.state.issueSummary;

    if (summary.get(health.danger) > 0) {
      return theme.health.danger;
    } else if (summary.get(health.warning) > 0) {
      return theme.health.warning;
    }

    return theme.health.ok;
  }
});

export default Issues;
