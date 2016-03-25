import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import * as timelineStore from 'in-stores/timeline';
import * as tracking from 'in-services/tracking';

import './TimeRangePicker.less';


const block = 'in-time-range-picker';

export default React.createClass({

  displayName: 'TimeRangePicker',

  mixins: [
    PureRenderMixin
  ],

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

  createButton(timeframe, label) {
    return (
      <span className={block + '__item'}
            onClick={() => this.onTimePickerItemClicked(timeframe)}>
        {label}
      </span>
    );
  },

  onTimePickerItemClicked(timeframe) {
    tracking.events.changingTimeWindowUsingTimeline();
    timelineStore.setTimeframe(timeframe);
  }
});
