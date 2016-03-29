import PureRenderMixin from 'react-addons-pure-render-mixin';
import {combineLatest} from 'reactive-observables';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {setHighlightedEntityId, clearHighlightedEntityId} from 'in-services/stores/highlightedEntityId';
import * as serverTimeStore from 'in-stores/serverTime';
import * as timelineStore from 'in-stores/timeline';
import connectTo from 'in-hoc/connectTo';

import {issue$} from './timelineStores';
import IssueLine from './IssueLine';
import Issue from './Issue';

import './Eventline.less';


const rpt = React.PropTypes;
const block = 'in-timeline-eventline';

export default connectTo({
    times: combineLatest([serverTimeStore.serverTime, timelineStore.timeframe])
            .map(([serverTime, timeframe]) => {
              return {
                serverTime,
                timeframe
              };
            }),
    issues: issue$,
    focusedMoment: timelineStore.focusedMoment
  },
  React.createClass({
    displayName: 'Eventline',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      times: rpt.shape({
        serverTime: rpt.number.isRequired,
        timeframe: timelineStore.timeframeShape.isRequired
      }),
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
      const times = this.props.times;
      if (!times) {
        return null;
      }

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

      const times = this.props.times;
      const maxOldestPermittedIssueTimestamp = times.serverTime - times.timeframe.windowSize;
      const maxNewestTimeStamp = times.timeframe.to ? times.timeframe.to : Infinity;

      return issues
        .filter(issue => {
          const start = issue.get('start');
          return start > maxOldestPermittedIssueTimestamp &&
                 start < maxNewestTimeStamp;
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
  })
);
