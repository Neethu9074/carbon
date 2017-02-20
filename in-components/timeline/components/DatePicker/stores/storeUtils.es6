import {combineLatest} from 'reactive-observables';

import {parseDateTime, formatDateTime, formatTime, formatDate, parseDate} from 'in-services/formatters/date';
import {bigBangTimestamp$} from 'in-stores/timeline';
import {serverTime$} from 'in-stores/serverTime';


export function cutMillis(time) {
  return ((time / 1000) | 0) * 1000;
}

export function setTimestamp(timestamp, setDateString, setTimeString) {
  const date = new Date(timestamp);
  setDateString(formatDate(date.getTime()));
  setTimeString(formatTime(date.getTime()));
}

const referenceTimestamps$ = combineLatest([serverTime$, bigBangTimestamp$])
                             .map(([serverTime, bigBangTimestamp]) => {
                               serverTime = cutMillis(serverTime);
                               bigBangTimestamp = cutMillis(bigBangTimestamp);

                               return {
                                 serverTime,
                                 bigBangTimestamp
                               };
                             });

export function getValidation$(timestamp$) {
  return combineLatest([referenceTimestamps$, timestamp$])
         .map(([{serverTime, bigBangTimestamp}, timestamp]) => {
           const timestamp_date = parseDate(formatDate(timestamp)).getTime();

           const bigBangTimestamp_date = parseDate(formatDate(bigBangTimestamp)).getTime();
           const serverTime_date = parseDate(formatDate(serverTime)).getTime();

           const validationObject = {
             date: true,
             time: true,
             timestamp,
             timestamp_date,
             bigBangTimestamp,
             bigBangTimestamp_date,
             serverTime,
             serverTime_date,
             error: null
           };

           validationObject.date = bigBangTimestamp_date <= timestamp_date && timestamp_date <= serverTime_date;

           // we don't want to validate the time when the date is already invalid. Makes no sense to validate
           // it since our basis for invalidation is not existing.
           validationObject.time = (!validationObject.date) ? true : (bigBangTimestamp <= timestamp && timestamp <= serverTime);

           if (!validationObject.date || !validationObject.time) {
             validationObject.error = `Please enter a date within the monitored time range in the format (YYYY-MM-DD). \n ` +
                                      `The monitored time range is from ${formatDateTime(bigBangTimestamp)} to ${formatDateTime(serverTime)} `;
           }

           return validationObject;
         });
}

export function getTimestamp$(dateString$, timeString$) {
  return combineLatest([dateString$, timeString$])
         .map(([dateAsString, timeAsString]) => {
           return parseDateTime(dateAsString + ' ' + timeAsString).getTime();
         });
}
