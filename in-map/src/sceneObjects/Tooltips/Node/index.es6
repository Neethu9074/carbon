import Immutable from 'immutable';
import React from 'react/addons';
import moment from 'moment';

import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import {getProblemsForSnapshot} from 'in-services/issueTracker';
import IssueStatusLine from 'in-components/Tooltips/StatusLine';
import TooltipFrame from 'in-components/Tooltips/Frame';
import Heading from 'in-components/Tooltips/Heading';
import Content from 'in-components/Tooltips/Content';
import {getHealth} from 'in-services/issueTracker';
import {getSingular} from 'in-sdk/pluginName';
import {health} from 'in-services/health';
import {getLabel} from 'in-sdk/snapshot';

import Tooltip from '../Tooltip';

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
    if(!this.props.snapshot) {
      return null;
    }

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
    }

    return (
      <TooltipFrame>
        <Content className={heading.cssClass}>
          {heading.text.toUpperCase()}
        </Content>
      </TooltipFrame>
    );
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
