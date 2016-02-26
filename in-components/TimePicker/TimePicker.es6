import PureRenderMixin from 'react-addons-pure-render-mixin';
import {IntlMixin} from 'react-intl';
import React from 'react';

import * as timelineStore from 'in-services/stores/timeline';
import * as tracking from 'in-services/tracking';

import './TimePicker.less';

const rpt = React.PropTypes;
const block = 'in-timepicker';

const TimePicker = React.createClass({
  mixins: [
    PureRenderMixin,
    IntlMixin
  ],

  propTypes: {
    onTimeSelected: rpt.func,
    className: rpt.any
  },

  render() {
    const className = this.props.className ? block + ' ' + this.props.className : block;
    return (
      <div className={className}>
        <div className={block + '__heading'}>
          <span className={block + '__key'}>
            Time
          </span>
          <span className={block + '__value'}>
            Rollup
          </span>
        </div>
        {this.createButton(1000 * 60 * 10, 'timePicker.time1', '1 sec')}
        {this.createButton(1000 * 60 * 60, 'timePicker.time2', '5 sec')}
        {this.createButton(1000 * 60 * 60 * 12, 'timePicker.time3', '1 min')}
        {this.createButton(1000 * 60 * 60 * 24, 'timePicker.time4', '2 min')}
      </div>
    );
  },

  createButton(timeRange, content, aggregatedTimeRange) {
    const labels = this.getIntlMessage(content);
    return this.createEntry(
      labels.long,
      aggregatedTimeRange,
      () => this.onTimePickerItemClicked(timeRange, labels)
    );
  },

  createEntry(key, value, onClick) {
    return (
      <div className={block + '__entry'}
           onClick={onClick}>
        <span className={block + '__key'}>
          {key}
        </span>
        <span className={block + '__value'}>
          {value}
        </span>
      </div>
    );
  },

  onTimePickerItemClicked(newTime, labels) {
    tracking.events.changingTimeWindowUsingTimeline();
    timelineStore.setTimeframe(newTime);

    if (this.props.onTimeSelected) {
      this.props.onTimeSelected(labels);
    }
  }
});

export default TimePicker;
