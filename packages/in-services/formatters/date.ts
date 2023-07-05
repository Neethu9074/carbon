/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { zonedTimeToUtc } from 'date-fns-tz';
import { parse } from 'date-fns';

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
export const dateFormat = 'yyyy-MM-dd';
export const dateTimeFormat = dateFormat + ' ' + timeFormat;

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
  const dateAccordingToLocalTime: Date = parseDateAccordingToLocalTime(dateString);
  // Need to replicate the same behaviour as parseDateAccordingToLocalTime which returns NaN upon an invalid date
  // If this check doesn't exist then an error gets thrown which may crash UI elements
  if (isNaN(dateAccordingToLocalTime.getTime())) return dateAccordingToLocalTime;
  return zonedTimeToUtc(dateAccordingToLocalTime, 'UTC');
}

function parseDateAccordingToLocalTime(dateString: string): Date {
  return parse(dateString, dateFormat, new Date());
}

export function parseDateTime(dateTimeString: string): Date {
  return parseDateTimeInternal(dateTimeString);
}

function parseDateTimeAsUtc(dateTimeString: string): Date {
  const dateTimeAccordingToLocalTime: Date = parseDateTimeAccordingToLocalTime(dateTimeString);
  // Need to replicate the same behaviour as parseDateTimeAccordingToLocalTime which returns NaN upon an invalid date
  // If this check doesn't exist then an error gets thrown which may crash UI elements
  if (isNaN(dateTimeAccordingToLocalTime.getTime())) return dateTimeAccordingToLocalTime;
  return zonedTimeToUtc(dateTimeAccordingToLocalTime, 'UTC');
}

function parseDateTimeAccordingToLocalTime(dateTimeString: string): Date {
  return parse(dateTimeString, dateTimeFormat, new Date());
}
