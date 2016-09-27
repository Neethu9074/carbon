import {combineLatest} from 'reactive-observables';

import {formatTime, formatDate, parseDateTime, parseDate} from 'in-services/formatters/date';
import {bigBangTimestamp$, focusedMoment$} from 'in-stores/timeline';
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


export const isDateTimeValid$ =
  combineLatest([serverTime$, dateString$, timeString$, bigBangTimestamp$])
  .map(([serverTime, dateAsString, timeAsString, bigBangTimestamp]) => {
    serverTime = cutMillis(serverTime);
    bigBangTimestamp = cutMillis(bigBangTimestamp);

    return validateTime(parseDateTime(dateAsString + ' ' + timeAsString).getTime(), bigBangTimestamp, serverTime);
  });


export function validateTime(time, from, to) {
  const isValid = {
    date: true,
    time: true
  };

  const timeDateComponent = parseDate(formatDate(time)).getTime();
  const fromDateComponent = parseDate(formatDate(from)).getTime();
  const toDateComponent = parseDate(formatDate(to)).getTime();

  isValid.date = fromDateComponent <= timeDateComponent && timeDateComponent <= toDateComponent;

  if (!isValid.date) {
    // we don't want to validate the time when the date is already invalid. Makes no sense to validate
    // it since our basis for invalidation is not existing.
    isValid.time = true;
  } else {
    isValid.time = from <= time && time <= to;
  }

  return isValid;
}


function cutMillis(time) {
  return ((time / 1000) | 0) * 1000;
}

export function setTimeString(newTime) {
  timeString.applyStateMutation(() => newTime);
}

export function reset() {
  focusedMoment$.once(_focusedMoment => {
    if (_focusedMoment) {
      setTimestamp(_focusedMoment);
    } else {
      serverTime$.once(_serverTime => setTimestamp(_serverTime));
    }
  });
}

function setTimestamp(timestamp) {
  const date = new Date(timestamp);
  setDateString(formatDate(date.getTime()));
  setTimeString(formatTime(date.getTime()));
}
