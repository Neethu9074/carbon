'use strict';

import React from 'react/addons';
import Tooltip from '../Tooltip';
import {getHealth} from 'instana-ui-services/issueTracker';
import {health} from 'instana-ui-services/health';
import {getProblemsForSnapshot} from 'instana-ui-services/issueTracker';
import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';

import TooltipFrame from '../index';
import IssueStatusLine from '../IssueStatusLine';
import Heading from '../Heading';
import Content from '../Content';

import './index.less';


/*eslint-disable no-unused-vars*/
const StickyNoteRC = React.createClass({

  mixins: [
    React.addons.PureRenderMixin,
    SubscriptionMixin
  ],

  propTypes: {
    snapshot: React.PropTypes.object.isRequired
  },

  getInitialState() {
    return {health: health.ok};
  },

  componentDidMount() {
    this.addSubscription(getHealth(this.props.snapshot)
      .subscribe(h => this.setState({health: h})));

    this.addSubscription(getProblemsForSnapshot(this.props.snapshot)
      .subscribe(issues => this.setState({issues})));
  },

  getStatusLine() {
    const state = this.state;
    const nodeHealth = state.health;
    const issues = state.issues;
    const data = this.props.snapshot.get('data');

    //only show the status line if there is a "bad" health or some issues
    if(nodeHealth !== health.ok && this.issuesAvailable()) {
        try {
          return (<IssueStatusLine
            hostname={data.get('hostname')}
            time={issues.get(0).get('start')} />);
        } catch (err) {
          return <IssueStatusLine hostname={data.get('hostname')} />;
        }
    }
    return null;
  },

  getHeading() {
    const nodeHealth = this.state.health;
    const data = this.props.snapshot.get('data');
    const issues = this.state.issues;

    let text = data.get('hostname');
    let cssClass = '';

    if(this.issuesAvailable()) {
      text = issues.getIn([0, 'problemText']);
      cssClass = 'in-tooltip__node-heading--' + nodeHealth;

      if(text === undefined) {
        text = data.get('hostname');
        cssClass = '';
      }
    }

    return {text, cssClass};
  },

  issuesAvailable() {
    const issues = this.state.issues;
    return (issues && issues.size > 0);
  },

  getContent() {
    let content = 'this is a great server';

    if(this.issuesAvailable()) {
      const suggestion = this.state.issues.getIn([0, 'fixSuggestion']);
      if(suggestion) {
        content = suggestion;
      }
    }
    return content;
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
