import moment from 'moment';

import {timeFormat, formatTime, dateFormat, formatDate} from 'in-services/formatters/date';
import {createStore} from 'in-stores/store';


const dateIsValid = createStore({
  name: 'datePickerDateIsValidStore',
  initialValue: false
});
export const dateIsValid$ = dateIsValid.observable;

const dateString = createStore({
  name: 'datePickerDateStringStore',
  initialValue: ''
});
export const dateString$ = dateString.observable;

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
export const timeIsValid$ = timeIsValid.observable;

export function setTimeString(newTime) {
  timeString.applyStateMutation(() => newTime);
  timeIsValid.applyStateMutation(() => moment(newTime, timeFormat).isValid());
}

export function reset() {
  const date = new Date();
  setDateString(formatDate(date.getTime()));
  setTimeString(formatTime(date.getTime()));
}
