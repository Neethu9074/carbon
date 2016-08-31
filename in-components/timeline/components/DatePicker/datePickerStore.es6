import {combineLatest} from 'reactive-observables';
import moment from 'moment';

import {formatTime, dateFormat, timeFormat, formatDate} from 'in-services/formatters/date';
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


export const isDateTimeValid$ =
  combineLatest([serverTime$, dateString$, timeString$, bigBangTimestamp$])
  .map(([serverTime, dateAsString, timeAsString, bigBangTimestamp]) => {
    serverTime = cutMillis(serverTime);
    bigBangTimestamp = cutMillis(bigBangTimestamp);

    const isValid = {
      date: true,
      time: true
    };

    const date = moment(dateAsString, dateFormat);
    const dateAsTimestamp = date.valueOf();
    const serverTimeAsDateTimestamp = moment(serverTime).valueOf();
    const bigBangAsDateTimestamp = moment(formatDate(bigBangTimestamp), dateFormat).valueOf();

    const dateTime = cutMillis(moment(dateAsString + timeAsString, dateFormat + timeFormat).valueOf());

    // if the selected timestamp is bigger than the servertime
    // this can only happen if at least the time is "to big"
    isValid.time = (dateTime > serverTime || dateTime < bigBangTimestamp)
      ? false
      : isValid.time;

    // if the only date is out of range, set it to false
    isValid.date = (dateAsTimestamp < bigBangAsDateTimestamp || dateAsTimestamp > serverTimeAsDateTimestamp)
      ? false
      : isValid.date;

    return isValid;
  });

function cutMillis(time) {
  return ((time / 1000) | 0) * 1000;
}

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
