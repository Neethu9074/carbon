'use strict';

import React from 'react/addons';
import Immutable from 'immutable';
import moment from 'moment';
import Tooltip from '../Tooltip';
import {getHealth} from 'instana-ui-services/issueTracker';
import {health} from 'instana-ui-services/health';
import {getProblemsForSnapshot} from 'instana-ui-services/issueTracker';
import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';

import TooltipFrame from 'instana-ui-components/Tooltips/Frame';
import IssueStatusLine from 'instana-ui-components/Tooltips/StatusLine';
import Heading from 'instana-ui-components/Tooltips/Heading';
import Content from 'instana-ui-components/Tooltips/Content';

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
    return {health: health.ok, issues: Immutable.List()};
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
    const issues = state.issues
      .sortBy(problem => problem.get('severity'))
      .reverse();
    const data = this.props.snapshot.get('data');

    //only show the status line if there is a "bad" health or some issues
    if(nodeHealth !== health.ok && this.issuesAvailable()) {
        try {
          return (<IssueStatusLine
            left={data.get('hostname')}
            right={moment(issues.get(0).get('start')).fromNow()}/>);
        } catch (err) {
          return <IssueStatusLine left={data.get('hostname')} />;
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
    return this.state.issues.size > 0;
  },

  getContent() {
    let content = '';

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

    if(this.issuesAvailable()) {
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
    } else {
      return (
        <TooltipFrame>
          <Content className={heading.cssClass}>
            {heading.text.toUpperCase()}
          </Content>
        </TooltipFrame>
      );
    }
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
