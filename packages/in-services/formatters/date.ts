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

export function parseDate(dateString: string): Date {
  return parseDateInternal(dateString);
}

function parseDateAsUtc(dateString: string): Date {
  return moment.utc(dateString, dateFormat).toDate();
}

function parseDateAccordingToLocalTime(dateString: string): Date {
  return moment(dateString, dateFormat).toDate();
}

export function parseDateTime(dateTimeString: string): Date {
  return parseDateTimeInternal(dateTimeString);
}

function parseDateTimeAsUtc(dateTimeString: string): Date {
  return moment.utc(dateTimeString, dateTimeFormat).toDate();
}

function parseDateTimeAccordingToLocalTime(dateTimeString: string): Date {
  return moment(dateTimeString, dateTimeFormat).toDate();
}
