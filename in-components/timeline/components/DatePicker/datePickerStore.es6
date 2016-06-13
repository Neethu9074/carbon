import {combineLatest} from 'reactive-observables';
import moment from 'moment';

import {timeFormat, formatTime, dateFormat, formatDate} from 'in-services/formatters/date';
import {bigBangTimestamp$} from 'in-stores/timeline';
import {serverTime$} from 'in-stores/serverTime';
import {createStore} from 'in-stores/store';


const dateString = createStore({
  name: 'datePickerDateStringStore',
  initialValue: ''
});
export const dateString$ = dateString.observable;

export function setDateString(newDate) {
  dateString.applyStateMutation(() => newDate);
}

const timeString = createStore({
  name: 'datePickerTimeStringStore',
  initialValue: ''
});
export const timeString$ = timeString.observable;


const isDateTimeValid = createStore({
  name: 'isDateTimeValidStore',
  initialValue: {
    date: true,
    time: true
  }
});

export const isDateTimeValid$ =
  combineLatest([isDateTimeValid.observable, serverTime$, dateString$, timeString$, bigBangTimestamp$])
  .map(props => {
    const isValid = props[0];
    const serverTime = ((props[1] / 1000) | 0) * 1000;
    const dateAsString = props[2];
    const timeAsString = props[3];
    const bigBangTimestamp = ((props[4] / 1000) | 0) * 1000;

    isValid.date = true;
    isValid.time = true;

    const date = moment(dateAsString, dateFormat);
    const time = moment(timeAsString, timeFormat);
    const dateAsTimestamp = date.valueOf();
    const serverTimeAsDateTimestamp = moment(serverTime).valueOf();
    const bigBangAsDateTimestamp = moment(formatDate(bigBangTimestamp), dateFormat).valueOf();

    let dateTime = new Date();
    dateTime.setFullYear(date.year());
    dateTime.setMonth(date.month());
    dateTime.setDate(date.date());
    dateTime.setHours(time.hour());
    dateTime.setMinutes(time.minute());
    dateTime.setSeconds(time.second());
    dateTime = ((dateTime.valueOf() / 1000) | 0) * 1000;

    // if the selected timestamp is bigger than the servertime
    // this can only happen if at least the time is "to big"
    isValid.time = dateTime > serverTime || dateTime < bigBangTimestamp ?
      false : isValid.time;

    // if the only date is out of range, set it to false
    isValid.date = dateAsTimestamp < bigBangAsDateTimestamp || dateAsTimestamp > serverTimeAsDateTimestamp ?
      false : isValid.date;

    return isValid;
  });


export function setTimeString(newTime) {
  timeString.applyStateMutation(() => newTime);
}

export function reset() {
  serverTime$.once(timestamp => {
    const date = new Date(timestamp);
    setDateString(formatDate(date.getTime()));
    setTimeString(formatTime(date.getTime()));
  });
}
