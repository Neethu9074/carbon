import {combineLatest} from 'reactive-observables';
import moment from 'moment';

import {timeFormat, formatTime, dateFormat, formatDate} from 'in-services/formatters/date';
import {serverTime$} from 'in-stores/serverTime';
import {createStore} from 'in-stores/store';


const dateString = createStore({
  name: 'datePickerDateStringStore',
  initialValue: ''
});
export const dateString$ = dateString.observable;

const dateIsValid = createStore({
  name: 'datePickerDateIsValidStore',
  initialValue: false
});
export const dateIsValid$ =
  combineLatest([dateIsValid.observable, serverTime$, dateString$])
  .map(props => {
    const isValid = props[0];
    const serverTime = props[1];
    const dateAsString = props[2];

    // is the string itself is valid, but the date is in the future -> invalid
    if (isValid && moment(dateAsString, dateFormat).valueOf() > serverTime) {
      return false;
    }

    return isValid;
  });

export function setDateString(newDate) {
  dateString.applyStateMutation(() => newDate);
  dateIsValid.applyStateMutation(() => moment(newDate, dateFormat).isValid());
}


const timeString = createStore({
  name: 'datePickerTimeStringStore',
  initialValue: ''
});
export const timeString$ = timeString.observable;


const timeIsValid = createStore({
  name: 'datePickerTimeIsValidStore',
  initialValue: false
});
export const timeIsValid$ =
  combineLatest([timeIsValid.observable, serverTime$, timeString$])
  .map(props => {
    const isValid = props[0];
    const serverTime = props[1];
    const timeAsString = props[2];

    // is the string itself is valid, but the time is in the future -> invalid
    if (isValid && moment(timeAsString, timeFormat).valueOf() > serverTime) {
      return false;
    }

    return isValid;
  });

export function setTimeString(newTime) {
  timeString.applyStateMutation(() => newTime);
  timeIsValid.applyStateMutation(() => moment(newTime, timeFormat).isValid());
}

export function reset() {
  serverTime$.once(timestamp => {
    const date = new Date(timestamp);
    setDateString(formatDate(date.getTime()));
    setTimeString(formatTime(date.getTime()));
  });
}
