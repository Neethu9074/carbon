import React from 'react/addons';
import {IntlMixin} from 'react-intl';

import * as timelineStore from 'in-services/stores/timeline';
import * as tracking from 'in-services/tracking';

import Button from '../Button';

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
        <Button className={block + '__button'}
                onClick={() => this.onTimePickerItemClicked(1000 * 60 * 10)}>
           {this.getIntlMessage('timePicker.time1')}
        </Button>
        <Button className={block + '__button'}
                onClick={() => this.onTimePickerItemClicked(1000 * 60 * 60)}>
           {this.getIntlMessage('timePicker.time2')}
        </Button>
        <Button className={block + '__button'}
                onClick={() => this.onTimePickerItemClicked(1000 * 60 * 60 * 12)}>
           {this.getIntlMessage('timePicker.time3')}
        </Button>
        <Button className={block + '__button'}
                onClick={() => this.onTimePickerItemClicked(1000 * 60 * 60 * 24)}>
           {this.getIntlMessage('timePicker.time4')}
        </Button>
      </div>
    );
  },

  onTimePickerItemClicked(newTime) {
    tracking.trackEvent(tracking.events.changingTimeWindowUsingTimeline);
    timelineStore.setTimeframe(newTime);

    if (this.props.onTimeSelected) {
      this.props.onTimeSelected(newTime);
    }
  }
});

export default TimePicker;
