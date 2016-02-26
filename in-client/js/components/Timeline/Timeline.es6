import d3 from 'd3';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {combineLatest} from 'reactive-observables';

import ServerTime from 'in-components/ServerTime';
import connectTo from 'in-hoc/connectTo';
import * as timelineStore from 'in-services/stores/timeline';
import * as serverTimeStore from 'in-stores/serverTime';

import ChangeTimeButton from './ChangeTimeButton';
import Eventline from './Eventline';
import TimeRange from './TimeRange';

import './Timeline.less';

const block = 'in-timeline';

export default connectTo(
  () => {
    return {
      serverTime: serverTimeStore.serverTime,
      timeframe: timelineStore.timeframe,
      maxOldestPermittedIssueTimestamp: combineLatest(
          [serverTimeStore.serverTime, timelineStore.timeframe]
        ).map(([serverTime, timeframe]) => serverTime - timeframe)
    };
  },
  React.createClass({

  displayName: 'Timeline',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    serverTime: React.PropTypes.number.isRequired,
    timeframe: React.PropTypes.number.isRequired,
    maxOldestPermittedIssueTimestamp: React.PropTypes.number.isRequired
  },

  componentWillMount() {
    this.scale = d3.scale.linear().range([100, 0])
      .domain([
        this.props.serverTime,
        this.props.maxOldestPermittedIssueTimestamp
      ]);
  },

  componentWillReceiveProps(nextProps) {
    this.scale = this.scale.domain([
      nextProps.serverTime,
      nextProps.maxOldestPermittedIssueTimestamp
    ]);
  },

  render() {
    return (
      <div className={block}>
        <TimeRange serverTime={this.props.serverTime}
                   scale={this.scale}
                   maxOldestPermittedIssueTimestamp={this.props.maxOldestPermittedIssueTimestamp}/>
        <ChangeTimeButton />
        <Eventline renderedForTimestamp={this.props.serverTime}
                   scale={this.scale}
                   maxOldestPermittedIssueTimestamp={this.props.maxOldestPermittedIssueTimestamp} />
        <ServerTime className={block + '__servertime'} />
      </div>
    );
  }
}));
