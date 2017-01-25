import {combineLatest} from 'reactive-observables';

import {parseDateTime, formatTime, formatDate, parseDate} from 'in-services/formatters/date';
import {bigBangTimestamp$} from 'in-stores/timeline';
import {serverTime$} from 'in-stores/serverTime';


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

export function cutMillis(time) {
  return ((time / 1000) | 0) * 1000;
}

export function setTimestamp(timestamp, setDateString, setTimeString) {
  const date = new Date(timestamp);
  setDateString(formatDate(date.getTime()));
  setTimeString(formatTime(date.getTime()));
}


const referenceTimestamps$ = combineLatest([serverTime$, bigBangTimestamp$])
                             .map(([serverTimestamp, bigBangTimestamp]) => {
                               serverTimestamp = cutMillis(serverTimestamp);
                               bigBangTimestamp = cutMillis(bigBangTimestamp);

                               return {
                                 serverTimestamp,
                                 bigBangTimestamp
                               };
                             });

export function getValidation$(dateString$, timeString$) {
  return combineLatest([referenceTimestamps$, dateString$, timeString$,])
         .map(([{serverTimestamp, bigBangTimestamp}, dateAsString, timeAsString]) =>
           validateTime(parseDateTime(dateAsString + ' ' + timeAsString).getTime(), bigBangTimestamp, serverTimestamp));
}
