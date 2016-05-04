import PureRenderMixin from 'react-addons-pure-render-mixin';
import {dateUtils} from 'react-day-picker/utils';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import moment from 'moment';
import React from 'react';

import {timeFormat, dateFormat, formatDate} from 'in-services/formatters/date';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';
import Icon from 'in-components/Icon';

import {
  dateString$,
  timeString$,
  dateIsValid$,
  timeIsValid$,
  setDateString,
  setTimeString,
  reset
} from './datePickerStore';
import TextInput from './TextInput';

import './DatePicker.less';


const block = 'in-date-picker';
const rpt = React.PropTypes;

export default connectTo({
    dateIsValid: dateIsValid$,
    timeIsValid: timeIsValid$,
    dateString: dateString$,
    timeString: timeString$
  },
  React.createClass({

    displayName: 'DatePicker',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      applyDate: rpt.func.isRequired,
      dateString: rpt.string,
      timeString: rpt.string,
      dateIsValid: rpt.bool,
      timeIsValid: rpt.bool
    },

    componentWillMount() {
      reset();
    },

    render() {
      const date = this.getMergedDate();

      return (
        <div className={block}>
          <div className={block + '__heading'}>
            <Icon type='reset'
                  className={block + '__reset-button'}
                  onClick={reset}/>
            <Button className={block + '__apply-button'}
                    onClick={() => this.props.applyDate(this.getMergedDate())}>
              Apply
            </Button>
          </div>
          <div className={block + '__inputs'}>
            <TextInput heading={'Date'}
                       value={this.props.dateString}
                       isValid={this.props.dateIsValid}
                       validationMessage={'please enter a date in the form: ' + dateFormat}
                       onChange={setDateString} />

            <TextInput heading={'Time'}
                       value={this.props.timeString}
                       isValid={this.props.timeIsValid}
                       validationMessage={'please enter a time in the form: ' + timeFormat}
                       onChange={setTimeString} />
          </div>

          <DayPicker initialMonth={date}
                     modifiers={{
                       isSelected: day => {
                         return dateUtils.isSameDay(day, date);
                       }
                     }}
                     onDayClick={(e, day) => setDateString(formatDate(day))}/>
        </div>
      );
    },

    getMergedDate() {
      if (!this.props.dateIsValid  || !this.props.timeIsValid) {
        return undefined;
      }

      const date = moment(this.props.dateString, dateFormat);
      const time = moment(this.props.timeString, timeFormat);

      const dateTime = new Date();
      dateTime.setFullYear(date.year());
      dateTime.setMonth(date.month());
      dateTime.setDate(date.date());
      dateTime.setHours(time.hour());
      dateTime.setMinutes(time.minute());
      dateTime.setSeconds(time.second());
      return dateTime;
    }
  })
);
