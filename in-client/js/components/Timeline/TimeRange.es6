import PureRenderMixin from 'react-addons-pure-render-mixin';
import {combineLatest} from 'reactive-observables';
import moment from 'moment';
import React from 'react';

import * as serverTimeStore from 'in-stores/serverTime';
import * as timelineStore from 'in-stores/timeline';
import connectTo from 'in-hoc/connectTo';

import './TimeRange.less';


const rpt = React.PropTypes;
const block = 'in-timeline-timerange';

export default connectTo({
    times: combineLatest([serverTimeStore.serverTime, timelineStore.timeframe])
            .map(([serverTime, timeframe]) => {
              return {
                serverTime,
                timeframe
              };
            })
  },
  React.createClass({

    displayName: 'TimeRange',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      times: rpt.shape({
        timeframe: timelineStore.timeframeShape.isRequired,
        serverTime: rpt.number.isRequired
      }),
      serverTime: rpt.number.isRequired,
      scale: rpt.func.isRequired
    },

    render() {
      return (
        <div className={block}>
          {this.getTiles()}
        </div>
      );
    },

    getTiles() {
      const times = this.props.times;
      const max = (times.timeframe.to ? times.timeframe.to : times.serverTime ) - times.timeframe.windowSize;
      const now = this.props.serverTime;
      const scale = this.props.scale;
      const range = now - max;
      const numItems = 8;
      const spaceBetweenEachItem = 1 / numItems;

      const array = [];
      for (let i = 0; i < numItems; i++) {
        array.push((range / numItems) / 2 + max + range * i * spaceBetweenEachItem);
      }

      return array.map(time => {
        return (
          <div  key={time}
                className={block + '__tile'}
                style={{left: scale(time) + '%'}}>
            {moment(time).format('HH:mm:ss')}
          </div>);
      });
    }
  })
);
