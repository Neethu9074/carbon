import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import * as timelineStore from 'in-stores/timeline';
import * as tracking from 'in-services/tracking';
import connectTo from 'in-hoc/connectTo';

import './TimeRangePicker.less';


const block = 'in-time-range-picker';

export default connectTo({
    timeframe: timelineStore.timeframe
  },
  React.createClass({

    displayName: 'TimeRangePicker',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      timeframe: timelineStore.timeframeShape
    },

    render() {
      return (
        <div className={block}>
          {this.createButton(1000 * 60 * 10, '10 M')}
          {this.createButton(1000 * 60 * 60, '1 H')}
          {this.createButton(1000 * 60 * 60 * 12, '12 H')}
          {this.createButton(1000 * 60 * 60 * 24, '24 H')}
        </div>
      );
    },

    createButton(timerange, label) {
      const timeframe = this.props.timeframe;

      // if there is no to set (timerange) and the windowSize is the same as the timeframe for this button
      const className = !timeframe.to && timeframe.windowSize === timerange ?
        block + '__item ' + block + '__item--selected' :
        block + '__item';
      return (
        <span className={className}
              onClick={() => this.onTimePickerItemClicked(timerange)}>
          {label}
        </span>
      );
    },

    onTimePickerItemClicked(timeframe) {
      tracking.events.changingTimeWindowUsingTimeline();
      timelineStore.setTimeframe(timeframe);
    }
  })
);
