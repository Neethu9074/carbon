import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import {setHighlightedEntityId, clearHighlightedEntityId} from 'in-services/stores/highlightedEntityId';
import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import {focusedMoment} from 'in-services/stores/timeline';
import {getIssues} from 'in-services/issueTracker';
import connectTo from 'in-hoc/connectTo';

import IssueLine from './IssueLine';
import Issue from './Issue';

import './Eventline.less';

const rpt = React.PropTypes;
const block = 'in-timeline-eventline';

export default connectTo(
  () => {
    return {
      openIssues: getIssues().debounce(500),
      focusedMoment
    };
  },
  React.createClass({
  displayName: 'Eventline',

  mixins: [
    React.addons.PureRenderMixin,
    SubscriptionMixin
  ],

  propTypes: {
    maxOldestPermittedIssueTimestamp: rpt.number.isRequired,
    renderedForTimestamp: rpt.number.isRequired,
    scale: rpt.func.isRequired,
    focusedMoment: rpt.number,
    openIssues: irpt.list
  },

  getInitialState() {
    return {
      hoveredSnapshot: null,
      hoveredIssue: null
    };
  },

  render() {
    return (
      <div className={block}>
        {this.renderIssueLine()}
        {this.renderIssues()}
        {this.renderFocusedMoment()}
      </div>
    );
  },

  renderIssueLine() {
    const issue = this.state.hoveredIssue;
    if (!issue) {
      return null;
    }


    return (<IssueLine style={{left: this.props.scale(issue.get('start')).toFixed(2) + '%'}}
                       issue={issue}
                       scale={this.props.scale}/>);
  },

  renderIssues() {
    const openIssues = this.props.openIssues;
    if (!openIssues || openIssues.size === 0) {
      return null;
    }

    return openIssues
      .filter(issue => issue.get('start') > this.props.maxOldestPermittedIssueTimestamp)
      .map(issue => <Issue key={issue.get('id')}
                           mouseIn={this.mouseIn}
                           mouseOut={this.mouseOut}
                           issue={issue}
                           style={{
                             left: this.props.scale(issue.get('start')).toFixed(2) + '%'
                           }}/>
      );
  },

  mouseIn(issue) {
    this.setState({ hoveredIssue: issue });

    setHighlightedEntityId(issue.getIn(['problem', 'snapshotId']));
  },

  mouseOut() {
    this.setState({
      hoveredIssue: null
    });
    clearHighlightedEntityId();
  },

  renderFocusedMoment() {
    if (!this.props.focusedMoment) {
      return null;
    }

    return (
      <div className={block + '__focused-moment'}
           style={{
             left: this.props.scale(this.props.focusedMoment).toFixed(2) + '%'
           }}/>
    );
  }
}));
