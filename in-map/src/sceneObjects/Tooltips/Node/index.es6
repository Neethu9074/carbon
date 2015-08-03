'use strict';

import React from 'react/addons';
import Immutable from 'immutable';
import moment from 'moment';
import Tooltip from '../Tooltip';
import {getHealth} from 'in-services/issueTracker';
import {health} from 'in-services/health';
import {getLabel} from 'in-sdk/snapshot';
import {getSingular} from 'in-sdk/pluginName';
import {getProblemsForSnapshot} from 'in-services/issueTracker';
import SubscriptionMixin from 'in-services/util/SubscriptionMixin';

import TooltipFrame from 'in-components/Tooltips/Frame';
import IssueStatusLine from 'in-components/Tooltips/StatusLine';
import Heading from 'in-components/Tooltips/Heading';
import Content from 'in-components/Tooltips/Content';

import './index.less';


/*eslint-disable no-unused-vars*/
const NodeTooltipRC = React.createClass({

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
    const snapshot = this.props.snapshot;
    const data = snapshot.get('data');
    const issues = this.state.issues;

    let text = getSingular(snapshot.get('pluginId')) + ': ' + getLabel(snapshot);
    let cssClass = '';

    if(this.issuesAvailable()) {
      text = issues.getIn([0, 'problemText']);
      cssClass = 'in-tooltip__node-heading--' + nodeHealth;
    }

    return {text, cssClass};
  },

  issuesAvailable() {
    return this.state.issues.filter(problem => problem.get('severity') > 0).size > 0;
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
  }

  render() {
    React.render(
      <NodeTooltipRC
        snapshot={this.parent.snapshot}
      />,
      this.stickyNoteContainer
    );
  }

  dispose() {
    super.dispose();
  }
}
