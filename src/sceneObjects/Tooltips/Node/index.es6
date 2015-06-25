'use strict';

import React from 'react/addons';
import Tooltip from '../Tooltip';
import {getHealth} from 'instana-ui-services/issueTracker';
import {health} from 'instana-ui-services/health';
import {
  getProblemsForSnapshot,
  getOpenIssues
} from 'instana-ui-services/issueTracker';

import TooltipFrame from '../index';
import IssueStatusLine from '../IssueStatusLine';
import Heading from '../Heading';
import Content from '../Content';

import './index.less';


const rpt = React.PropTypes;

/*eslint-disable no-unused-vars*/
const StickyNoteRC = React.createClass({

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: rpt.object.isRequired
  },

  getInitialState() {
    return {health: health.ok};
  },

  componentDidMount() {
    this.healthSubscription = getHealth(this.props.snapshot)
      .subscribe(h => this.setState({health: h}));

    this.issueSubscription = getProblemsForSnapshot(this.props.snapshot)
      .subscribe(issues => this.setState({issues}));
  },

  componentWillUnmount() {
    this.healthSubscription.dispose();
    this.healthSubscription = null;

    this.issueSubscription.dispose();
    this.issueSubscription = null;
  },

  getStatusLine() {
    const nodeHealth = this.state.health;
    const data = this.props.snapshot.get('data');
    if((nodeHealth === health.warning || nodeHealth === health.danger) &&
      this.state.issues && this.state.issues.size > 0) {
        return <IssueStatusLine
          hostname={data.get('hostname')}
          time={this.state.issues.get(0).get('start')} />;
    }
    return null;
  },

  getHeading() {
    const nodeHealth = this.state.health;
    const data = this.props.snapshot.get('data');

    let text = '';
    let cssClass = '';

    try {
      text = this.state.issues.get(0).get('problemText');
      cssClass = 'in-tooltip__node__heading__' + nodeHealth;
    } catch (er) {
      text = data.get('hostname');
      cssClass = '';
    }

    return {text, cssClass};
  },

  getContent() {
    try {
      return this.state.issues.get(0).get('fixSuggestion');
    } catch (er) {
      return 'this is a great server';
    }
  },

  render() {
    const heading = this.getHeading();

    return (
      <TooltipFrame>
        {this.getStatusLine()}
        <Heading className={heading.cssClass}>
          {heading.text.toUpperCase()}
        </Heading>
        <Content>
          {this.getContent()}
        </Content>
      </TooltipFrame>
    );
  }
});
/*eslint-enable no-unused-vars*/

export default class TooltipNode extends Tooltip {
  constructor(parent) {
    super(parent);
    this.render();
  }

  render() {
    React.render(
      <StickyNoteRC
        snapshot={this.parent.snapshot}
      />,
      this.stickyNoteContainer
    );
  }

  dispose() {
    super.dispose();
  }
}
