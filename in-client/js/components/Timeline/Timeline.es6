import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';
import d3 from 'd3';

import * as serverTimeStore from 'in-stores/serverTime';
import * as timelineStore from 'in-stores/timeline';
import connectTo from 'in-hoc/connectTo';

import ChangeTimeButtonFrom from './ChangeTimeButtonFrom';
import ChangeTimeButtonTo from './ChangeTimeButtonTo';
import TimeRange from './TimeRange';
import Eventline from './Eventline';

import './Timeline.less';


const block = 'in-timeline';

export default connectTo({
    serverTime: serverTimeStore.serverTime,
    timeframe: timelineStore.timeframe
  },
  React.createClass({

    displayName: 'Timeline',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      serverTime: React.PropTypes.number.isRequired,
      timeframe: timelineStore.timeframeShape
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
          <TimeRange scale={this.scale}/>
          <ChangeTimeButtonFrom/>
          <Eventline scale={this.scale} />
          <ChangeTimeButtonTo/>
        </div>
      );
    }
  })
);
