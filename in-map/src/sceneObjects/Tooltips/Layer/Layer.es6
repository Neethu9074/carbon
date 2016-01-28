import Immutable from 'immutable';
import React from 'react/addons';

import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import {getIssuesForSnapshot} from 'in-services/issueTracker';
import IssueDescription from 'in-components/IssueDescription';
import TooltipFrame from 'in-components/Tooltips/Frame';
import Content from 'in-components/Tooltips/Content';
import {getLabel} from 'in-sdk/snapshot';

import Tooltip from '../Tooltip.es6';

const LayerTooltipRC = React.createClass({
  mixins: [
    React.addons.PureRenderMixin,
    SubscriptionMixin
  ],

  propTypes: {
    snapshot: React.PropTypes.object.isRequired
  },

  getInitialState() {
    return {
      issues: Immutable.List()
    };
  },

  componentDidMount() {
    this.addSubscription(getIssuesForSnapshot(this.props.snapshot).subscribe(issues => this.setState({issues})));
  },

  issuesAvailable() {
    return this.state.issues.some(issue => issue.getIn(['problem', 'severity']) > 0);
  },

  getMostImportantIssue() {
    return this.state.issues.reduce((issueA, issueB) => {
      if (issueA.getIn(['problem', 'severity']) >= issueB.getIn(['problem', 'severity'])) {
        return issueA;
      }
      return issueB;
    });
  },

  render() {
    const snapshot = this.props.snapshot;
    if (!snapshot) {
      return null;
    }

    if (this.issuesAvailable()) {
      return (
        <TooltipFrame>
          <IssueDescription issue={this.getMostImportantIssue()}
                            plugin={snapshot.get('pluginId')}/>
        </TooltipFrame>
      );
    }

    return (
      <TooltipFrame>
        <Content>
          {getLabel(snapshot)}
        </Content>
      </TooltipFrame>
    );
  }
});


export default class TooltipLayer extends Tooltip {
  constructor(parent) {
    super(parent);
  }

  render() {
    React.render(
      <LayerTooltipRC snapshot={this.parent.snapshot} />,
      this.stickyNoteContainer
    );
  }
}
