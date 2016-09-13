import PureRenderMixin from 'react-addons-pure-render-mixin';
import {dateUtils} from 'react-day-picker/utils';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import React from 'react';

import {formatDate, parseDate, parseTime, mergeDates, dateFormat, timeFormat} from 'in-services/formatters/date';
import {toggleShowTimeSelector, interactableTimelineHeight$} from 'in-components/timeline/timelineStore';
import throttleNextFrame from 'in-services/util/throttleNextFrame';
import {timeframe$} from 'in-components/timeline/timelineStore';
import {setTo, setFocusedMoment} from 'in-stores/timeline';
import {bigBangTimestamp$} from 'in-stores/timeline';
import {serverTime$} from 'in-stores/serverTime';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';
import Icon from 'in-components/Icon';

import {
  dateString$,
  timeString$,
  isDateTimeValid$,
  setDateString,
  setTimeString,
  reset
} from './datePickerStore';
import TextInput from './TextInput';

import './DatePicker.less';


const block = 'in-date-picker';
const rpt = React.PropTypes;

export default connectTo({
    bigBangTimestamp: bigBangTimestamp$,
    isDateTimeValid: isDateTimeValid$,
    serverTime: serverTime$,
    dateString: dateString$,
    timeString: timeString$,
    timelineHeight: interactableTimelineHeight$
  },
  React.createClass({

    displayName: 'DatePicker',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      bigBangTimestamp: rpt.number,
      isDateTimeValid: rpt.shape({
        date: rpt.bool.isRequired,
        time: rpt.bool.isRequired
      }),
      serverTime: rpt.number,
      dateString: rpt.string,
      timeString: rpt.string,
      timelineHeight: rpt.number.isRequired
    },

    componentWillMount() {
      reset();
    },

    componentDidMount() {
      this.onMouseUp = throttleNextFrame(this.onMouseUp);
      window.addEventListener('mouseup', this.onMouseUp, false);
    },

    componentWillUnmount() {
      window.removeEventListener('mouseup', this.onMouseUp, false);
    },

    getInitialState() {
      return {
        month: new Date()
      };
    },

    render() {
      const isDateTimeValid = this.props.isDateTimeValid;
      if (!isDateTimeValid) {
        return null;
      }

      const date = this.getMergedDate();
      const bigBangTimestamp = this.props.bigBangTimestamp;
      const serverTime = this.props.serverTime;

      if (!bigBangTimestamp || !serverTime) {
        return null;
      }

      return (
        <div className={block}
             ref='timepicker'
             style={{
               bottom: `${this.props.timelineHeight}px`
             }}>
          <div className={block + '__heading'}>
            <Icon type='reset'
                  className={block + '__reset-button'}
                  onClick={reset}/>
            <Button className={block + '__apply-button'}
                    onClick={() => applyDate(this.getMergedDate())}>
              Apply
            </Button>
          </div>
          <div className={block + '__inputs'}>
            <TextInput heading={'Date'}
                       value={this.props.dateString}
                       isValid={this.props.isDateTimeValid.date}
                       validationMessage={'Please enter a date within the monitored time range ' +
                                          'in the format (' + dateFormat + ')'}
                       onChange={setDateString} />

            <TextInput heading={'Time'}
                       value={this.props.timeString}
                       isValid={this.props.isDateTimeValid.time}
                       validationMessage={'Please enter a time within the monitored time range ' +
                                          'in the format (' + timeFormat + ')'}
                       onChange={setTimeString} />
          </div>

          <DayPicker initialMonth={this.state.month}
                     modifiers={{
                       selected: day => dateUtils.isSameDay(day, date),
                       inactive: day => !dateUtils.isDayInRange(day, {
                         from: new Date(bigBangTimestamp),
                         to: new Date(serverTime)
                       })
                     }}
                     onDayClick={(e, day) => setDateString(formatDate(day))} />
        </div>
      );
    },

    getMergedDate() {
      if (!this.props.isDateTimeValid.date  || !this.props.isDateTimeValid.time) {
        return undefined;
      }

      const date = parseDate(this.props.dateString);
      const time = parseTime(this.props.timeString);
      return mergeDates(date, time);
    },

    onMouseUp(e) {
      // we are doing this asynchronously and the timepicker may already be gone
      if (!this.refs.timepicker) {
        return;
      }

      const rect = this.refs.timepicker.getBoundingClientRect();
      if (e.clientX > rect.right || e.clientX < rect.left ||
          e.clientY < rect.top || e.clientY > rect.bottom) {
        // the click was donw outside this component so close it
        toggleShowTimeSelector();
      }
    }
  })
);

function applyDate(date) {
  timeframe$.once(timeframe =>
    serverTime$.once(serverTime => {
      const focusedMoment = Math.min(serverTime, Date.parse(date));
      if (focusedMoment) {
        setFocusedMoment(focusedMoment);
        setTo(focusedMoment + timeframe.windowSize / 2);
      }
    })
  );
}
