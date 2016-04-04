/* eslint-disable react/no-multi-comp */
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {dateUtils} from 'react-day-picker/utils';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import moment from 'moment';
import React from 'react';

import {timeFormat, formatTime, dateFormat, formatDate} from 'in-services/formatters/date';

import TextInput from './TextInput';

import './DatePicker.less';


const block = 'in-date-picker';
const rpt = React.PropTypes;

export default React.createClass({

  displayName: 'DatePicker',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    setDateTime: rpt.func.isRequired,
    heading: rpt.string
  },

  getInitialState() {
    const date = new Date();
    const dateString = formatDate(date.getTime());
    const timeString = formatTime(date.getTime());
    return {
      dateString,
      timeString,
      dateIsValid: this.checkDate(dateString),
      timeIsValid: this.checkTime(timeString)
    };
  },

  componentWillUpdate(props, state) {
    if (!state.dateIsValid || !state.timeIsValid) {
      this.props.setDateTime(null);
    } else {
      this.props.setDateTime(this.getMergedDate(state));
    }
  },

  render() {
    const date = this.getMergedDate(this.state);

    return (
      <div className={block}>
        {this.props.heading ?
          <h1 className={block + '__heading'}>
            {this.props.heading}
          </h1>
          : null
        }

        <div className={block + '__inputs'}>
          <TextInput heading={'Date'}
                     value={this.state.dateString}
                     isValid={this.state.dateIsValid}
                     validationMessage={'please enter a date in the form: ' + dateFormat}
                     onChange={this.onDateStringChanged} />

          <TextInput heading={'Time'}
                     value={this.state.timeString}
                     isValid={this.state.timeIsValid}
                     validationMessage={'please enter a time in the form: ' + timeFormat}
                     onChange={this.onTimeStringChanged} />
        </div>

        <DayPicker initialMonth={date}
                   modifiers={{
                     isSelected: day => {
                       return dateUtils.isSameDay(day, date);
                     }
                   }}
                   onDayClick={(e, day) => this.onDateStringChanged(formatDate(day))}/>
      </div>
    );
  },

  onDateStringChanged(dateString) {
    const dateIsValid = this.checkDate(dateString);
    this.setState({
      dateString,
      dateIsValid
    });
  },

  onTimeStringChanged(timeString) {
    const timeIsValid = this.checkTime(timeString);
    this.setState({
      timeString,
      timeIsValid
    });
  },

  checkDate(date) {
    return moment(date, dateFormat).isValid();
  },

  checkTime(time) {
    return moment(time, timeFormat).isValid();
  },

  getMergedDate(state) {
    const date = state.dateIsValid ? moment(state.dateString, dateFormat) : null;
    const time = state.timeIsValid ? moment(state.timeString, timeFormat) : null;

    if (!date || !time) {
      return undefined;
    }

    const dateTime = new Date();
    dateTime.setFullYear(date.year());
    dateTime.setMonth(date.month());
    dateTime.setDate(date.date());
    dateTime.setHours(time.hour());
    dateTime.setMinutes(time.minute());
    dateTime.setSeconds(time.second());
    return dateTime;
  }
});
