import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {setHighlightedEntityId, clearHighlightedEntityId} from 'in-services/stores/highlightedEntityId';
import {focusedMoment} from 'in-stores/timeline';
import connectTo from 'in-hoc/connectTo';

import {issue$} from './timelineStores';
import IssueLine from './IssueLine';
import Issue from './Issue';

import './Eventline.less';


const rpt = React.PropTypes;
const block = 'in-timeline-eventline';

export default connectTo({
    issues: issue$,
    focusedMoment
  },
  React.createClass({
  displayName: 'Eventline',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    maxOldestPermittedIssueTimestamp: rpt.number.isRequired,
    renderedForTimestamp: rpt.number.isRequired,
    maxNewestTimeStamp: rpt.number.isRequired,
    scale: rpt.func.isRequired,
    focusedMoment: rpt.number,
    issues: irpt.list
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

    return (
      <IssueLine style={{left: this.props.scale(issue.get('start')).toFixed(2) + '%'}}
                 issue={issue}
                 scale={this.props.scale}/>
    );
  },

  renderIssues() {
    const issues = this.props.issues;
    if (!issues || issues.size === 0) {
      return null;
    }

    return issues
      .filter(issue => {
        const start = issue.get('start');
        return start > this.props.maxOldestPermittedIssueTimestamp &&
               start < this.props.maxNewestTimeStamp;
      })
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
