import PureRenderMixin from 'react-addons-pure-render-mixin';
import {combineLatest} from 'reactive-observables';
import React from 'react';
import d3 from 'd3';

import * as timelineStore from 'in-services/stores/timeline';
import * as serverTimeStore from 'in-stores/serverTime';
import connectTo from 'in-hoc/connectTo';

import ChangeTimeButton from './ChangeTimeButton';
import Eventline from './Eventline';
import TimeRange from './TimeRange';

import './Timeline.less';


const rpt = React.PropTypes;
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
    maxOldestPermittedIssueTimestamp: rpt.number.isRequired,
    serverTime: rpt.number.isRequired,
    timeframe: rpt.number.isRequired
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

        <ChangeTimeButton onTimeSelected={time => console.log('select from ', time)}
                          align={'left'}/>

        <Eventline renderedForTimestamp={this.props.serverTime}
                   scale={this.scale}
                   maxOldestPermittedIssueTimestamp={this.props.maxOldestPermittedIssueTimestamp} />

        <ChangeTimeButton onTimeSelected={time => console.log('select to ', time)}
                          align={'right'}/>
      </div>
    );
  }
}));
