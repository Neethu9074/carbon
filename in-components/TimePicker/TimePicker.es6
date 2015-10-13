import {IntlMixin} from 'react-intl';
import React from 'react/addons';

import * as timelineStore from 'in-services/stores/timeline';
import * as tracking from 'in-services/tracking';

import './TimePicker.less';

const rpt = React.PropTypes;
const block = 'in-timepicker';

const TimePicker = React.createClass({
  mixins: [
    React.addons.PureRenderMixin,
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
        {this.createButton(1000 * 60 * 10, 'timePicker.time1')}
        {this.createButton(1000 * 60 * 60, 'timePicker.time2')}
        {this.createButton(1000 * 60 * 60 * 12, 'timePicker.time3')}
        {this.createButton(1000 * 60 * 60 * 24, 'timePicker.time4')}
      </div>
    );
  },

  createButton(timeRange, content) {
    const labels = this.getIntlMessage(content);
    return (
      <div  className={block + '__button'}
            onClick={() => this.onTimePickerItemClicked(timeRange, labels)}>
        {labels.long}
      </div>
    );
  },

  onTimePickerItemClicked(newTime, labels) {
    tracking.trackEvent(tracking.events.changingTimeWindowUsingTimeline);
    timelineStore.setTimeframe(newTime);

    if (this.props.onTimeSelected) {
      this.props.onTimeSelected(labels);
    }
  }
});

export default TimePicker;
