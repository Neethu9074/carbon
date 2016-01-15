import irpt from 'react-immutable-proptypes';
import Immutable from 'immutable';
import React from 'react/addons';
import moment from 'moment';

import IssueStatusLine from 'in-components/Tooltips/StatusLine';
import {health, mapHealthToColor} from 'in-services/health';
import TooltipFrame from 'in-components/Tooltips/Frame';
import Heading from 'in-components/Tooltips/Heading';
import Content from 'in-components/Tooltips/Content';
import getSnapshot from 'in-hoc/getSnapshot';
import {getLabel} from 'in-sdk/snapshot';

import Tooltip from '../Tooltip.es6';

const LayerTooltipRC = getSnapshot(React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    snapshotId: React.PropTypes.string.isRequired,
    snapshot: irpt.map
  },

  getInitialState() {
    return {
      health: health.ok,
      issues: Immutable.List()
    };
  },

  componentDidMount() {
    // TODO: get health and problems by ID
    // const snapshot = this.state.snapshot;
    // this.addSubscription(getHealth(snapshot).subscribe(h => this.setState({health: h})));
    // this.addSubscription(getProblemsForSnapshot(snapshot).subscribe(issues => this.setState({issues})));
  },

  getStatusLine() {
    const state = this.state;
    const nodeHealth = state.health;
    const snapshot = this.state.snapshot;
    const issues = state.issues
      .sortBy(problem => problem.get('severity'))
      .reverse();

    // only show the status line if there is a "bad" health or some issues
    if (nodeHealth !== health.ok && this.issuesAvailable()) {
        try {
          return (<IssueStatusLine
            left={getLabel(snapshot)}
            right={moment(issues.get(0).get('start')).fromNow()}/>);
        } catch (err) {
          return <IssueStatusLine left={snapshot.getIn(['data', 'hostname'])} />;
        }
    }
    return null;
  },

  getHeading() {
    const mostImportantProblem = this.state.issues.reduce((issueA, issueB) => {
      if (issueA.getIn(['problem', 'severity']) >= issueB.getIn(['problem', 'severity'])) {
        return issueA;
      }
      return issueB;
    });
    const text = mostImportantProblem.get('problemText');
    const style = { color: mapHealthToColor(this.state.health) };
    return {text, style};
  },

  issuesAvailable() {
    return this.state.issues.some(problem => problem.get('severity') > 0);
  },

  getContent() {
    let content = (
      <Content>
        {this.state.snapshot.get('hostId')}
      </Content>
    );
    const suggestion = this.state.issues.getIn([0, 'fixSuggestion']);
    if (suggestion) {
      content = <Content>{suggestion}</Content>;
    }

    return content;
  },

  render() {
    if (!this.props.snapshot) {
      return null;
    }

    const snapshot = this.props.snapshot;

    if (this.issuesAvailable()) {
      const heading = this.getHeading();
      const content = this.getContent();

      return (
        <TooltipFrame>
          {this.issuesAvailable() ? this.getStatusLine() : null}
          <Heading style={heading.style}>
            {heading.text}
          </Heading>
          {content}
        </TooltipFrame>
      );
    }

    return (
      <TooltipFrame>
        <Content>
          {snapshot.get('plugin')}
        </Content>
      </TooltipFrame>
    );
  }
}));


export default class TooltipLayer extends Tooltip {
  constructor(parent) {
    super(parent);
  }

  render() {
    React.render(
      <LayerTooltipRC snapshotId={this.parent.id} />,
      this.stickyNoteContainer
    );
  }
}
