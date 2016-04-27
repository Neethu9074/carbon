import PureRenderMixin from 'react-addons-pure-render-mixin';
import moment from 'moment';
import React from 'react';

import {always} from 'in-services/fixedStreams';
import * as serverTimeStore from 'in-stores/serverTime';
import * as timelineStore from 'in-stores/timeline';
import connectTo from 'in-hoc/connectTo';

import './TimeRange.less';


const rpt = React.PropTypes;
const block = 'in-timeline-timerange';

export default connectTo({
    timeframe: timelineStore.timeframe,
    max: timelineStore.focusedMoment$.flatMap(focusedMoment => {
      if (focusedMoment) {
        return always(focusedMoment);
      }
      return serverTimeStore.serverTime;
    })
  },
  React.createClass({

    displayName: 'TimeRange',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      timeframe: timelineStore.timeframeShape.isRequired,
      max: rpt.number.isRequired,
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
      const max = this.props.max;
      const min = max - this.props.timeframe.windowSize;
      const scale = this.props.scale;
      const range = max - min;
      const numItems = 8;
      const spaceBetweenEachItem = 1 / numItems;

      const array = [];
      for (let i = 0; i < numItems; i++) {
        array.push((range / numItems) / 2 + min + range * i * spaceBetweenEachItem);
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
