import PureRenderMixin from 'react-addons-pure-render-mixin';
import {IntlMixin} from 'react-intl';
import React from 'react';

import * as timelineStore from 'in-stores/timeline';
import * as tracking from 'in-services/tracking';

import './TimeRangePicker.less';


const rpt = React.PropTypes;
const block = 'in-time-range-picker';

export default React.createClass({

  displayName: 'TimeRangePicker',

  mixins: [
    PureRenderMixin,
    IntlMixin
  ],

  propTypes: {
    onTimeSelected: rpt.func
  },

  render() {
    return (
      <div className={block}>
        {this.createButton(1000 * 60 * 10, 'timePicker.time1')}
        {this.createButton(1000 * 60 * 60, 'timePicker.time2')}
        {this.createButton(1000 * 60 * 60 * 12, 'timePicker.time3')}
        {this.createButton(1000 * 60 * 60 * 24, 'timePicker.time4')}
      </div>
    );
  },

  createButton(timeRange, content) {
    const label = this.getIntlMessage(content);
    return (
      <span className={block + '__item'}
            onClick={() => this.onTimePickerItemClicked(timeRange, label)}>
        {label}
      </span>
    );
  },

  onTimePickerItemClicked(newTime, label) {
    tracking.events.changingTimeWindowUsingTimeline();
    timelineStore.setTimeframe(newTime);

    if (this.props.onTimeSelected) {
      this.props.onTimeSelected(label);
    }
  }
});
