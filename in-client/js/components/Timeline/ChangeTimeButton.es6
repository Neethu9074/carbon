import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import SubscriptionMixin from 'in-services/util/SubscriptionMixin';

import TimePicker from './TimePicker';

import './ChangeTimeButton.less';


const rpt = React.PropTypes;
const block = 'in-timeline-change-time-button';

export default React.createClass({

  displayName: 'ChangeTimeButton',

  mixins: [
    PureRenderMixin,
    SubscriptionMixin
  ],

  propTypes: {
    onTimeSelected: rpt.func.isRequired,
    align: rpt.string
  },

  getInitialState() {
    return {
      open: false,
      currentTime: '10M'
    };
  },

  render() {
    return (
      <div>
        {this.renderTimePicker()}
        <div className={block + (this.state.open ? ' ' + block + '__open' : '')}
             onClick={this.toggleTimePicker}>
          {this.state.currentTime}
        </div>
      </div>
    );
  },

  renderTimePicker() {
    if (this.state.open) {
      const timePickerClass = block + '__timepicker';
      return (
        <TimePicker onTimeSelected={this.onTimeChanged}
                    className={timePickerClass +
                               ' ' + timePickerClass + (this.props.align === 'left' ? '__left' : '__right')}/>
      );
    }
    return null;
  },

  onTimeChanged(labels) {
    this.setState({
      open: false,
      currentTime: labels.short
    });

    this.props.onTimeSelected(labels.short);
  },

  toggleTimePicker() {
    this.setState({ open: !this.state.open });
  }
});
