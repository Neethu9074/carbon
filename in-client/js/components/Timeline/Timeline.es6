import PureRenderMixin from 'react-addons-pure-render-mixin';
import {combineLatest} from 'reactive-observables';
import React from 'react';
import d3 from 'd3';

import * as serverTimeStore from 'in-stores/serverTime';
import * as timelineStore from 'in-stores/timeline';
import connectTo from 'in-hoc/connectTo';

import ChangeTimeButtonFrom from './ChangeTimeButtonFrom';
import ChangeTimeButtonTo from './ChangeTimeButtonTo';
import Eventline from './Eventline';

import './Timeline.less';


const block = 'in-timeline';
const rpt = React.PropTypes;

export default connectTo(
  () => {
    return {
      serverTime: serverTimeStore.serverTime,
      timeframe: timelineStore.timeframe,
      maxOldestPermittedIssueTimestamp: combineLatest(
          [serverTimeStore.serverTime, timelineStore.timeframe]
        ).map(([serverTime, timeframe]) => serverTime - timeframe.windowSize)
    };
  },
  React.createClass({

  displayName: 'Timeline',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    maxOldestPermittedIssueTimestamp: rpt.number.isRequired,
    serverTime: rpt.number.isRequired
  },

  componentWillMount() {
    this.scale = d3.scale.linear().range([100, 0]);
    this.updateDomain(this.props);
  },

  componentWillReceiveProps(nextProps) {
    this.updateDomain(nextProps);
  },

  updateDomain(props) {
    const timeframe = props.timeframe;
    const to = timeframe.to ? timeframe.to : props.serverTime;

    this.scale = this.scale.domain([
      to,
      to - timeframe.windowSize
    ]);
  },

  render() {
    return (
      <div className={block}>
        <ChangeTimeButtonFrom/>

        <Eventline renderedForTimestamp={this.props.serverTime}
                   scale={this.scale}
                   maxOldestPermittedIssueTimestamp={this.props.maxOldestPermittedIssueTimestamp} />

        <ChangeTimeButtonTo/>
      </div>
    );
  }
}));
