/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import moment from 'moment';

import { getSetting$ } from 'in-services/settings';

export {
  formatTime,
  formatTimeWithoutSeconds,
  formatDate,
  formatDateShort,
  formatDateTime,
  fromNow,
  formatDuration,
  formatDurationAccurately,
  fromNowAccurately
} from '@instana/format-date';

export const timeFormat = 'HH:mm:ss';
export const dateFormat = 'YYYY-MM-DD';
const dateTimeFormat = dateFormat + ' ' + timeFormat;

let parseDateInternal = parseDateAccordingToLocalTime;
let parseDateTimeInternal = parseDateTimeAccordingToLocalTime;

getSetting$('formatTimestampsAsUtc').subscribe(asUtc => {
  if (asUtc) {
    parseDateInternal = parseDateAsUtc;
    parseDateTimeInternal = parseDateTimeAsUtc;
  } else {
    parseDateInternal = parseDateAccordingToLocalTime;
    parseDateTimeInternal = parseDateTimeAccordingToLocalTime;
  }
});

export function parseDate(dateString) {
  return parseDateInternal(dateString);
}

function parseDateAsUtc(dateString) {
  return moment.utc(dateString, dateFormat).toDate();
}

function parseDateAccordingToLocalTime(dateString) {
  return moment(dateString, dateFormat).toDate();
}

export function parseDateTime(dateTimeString) {
  return parseDateTimeInternal(dateTimeString);
}

function parseDateTimeAsUtc(dateTimeString) {
  return moment.utc(dateTimeString, dateTimeFormat).toDate();
}

function parseDateTimeAccordingToLocalTime(dateTimeString) {
  return moment(dateTimeString, dateTimeFormat).toDate();
}
