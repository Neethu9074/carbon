/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import moment from 'moment';

import { getSetting$ } from 'in-services/settings';

const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const timeFormat = 'HH:mm:ss';
export const dateFormat = 'YYYY-MM-DD';
export const dateTimeFormat = dateFormat + ' ' + timeFormat;

let formatTimeInternal = formatTimeInternalAccordingToLocalTime;
let formatTimeWithoutSecondsInternal = formatTimeWithoutSecondsInternalAccordingToLocalTime;
let formatDateInternal = formatDateInternalAccordingToLocalTime;
let formatDateShortInternal = formatDateShortInternalAccordingToLocalTime;
let parseDateInternal = parseDateAccordingToLocalTime;
let parseDateTimeInternal = parseDateTimeAccordingToLocalTime;
let parseTimeInternal = parseTimeAccordingToLocalTime;

getSetting$('formatTimestampsAsUtc').subscribe(asUtc => {
  if (asUtc) {
    formatTimeInternal = formatTimeInternalAccordingToUTC;
    formatTimeWithoutSecondsInternal = formatTimeWithoutSecondsInternalAccordingToUTC;
    formatDateInternal = formatDateInternalAccordingToUTC;
    formatDateShortInternal = formatDateShortInternalAccordingToUtc;
    parseDateInternal = parseDateAsUtc;
    parseDateTimeInternal = parseDateTimeAsUtc;
    parseTimeInternal = parseTimeAsUtc;
  } else {
    formatTimeInternal = formatTimeInternalAccordingToLocalTime;
    formatTimeWithoutSecondsInternal = formatTimeWithoutSecondsInternalAccordingToLocalTime;
    formatDateInternal = formatDateInternalAccordingToLocalTime;
    formatDateShortInternal = formatDateShortInternalAccordingToLocalTime;
    parseDateInternal = parseDateAccordingToLocalTime;
    parseDateTimeInternal = parseDateTimeAccordingToLocalTime;
    parseTimeInternal = parseTimeAccordingToLocalTime;
  }
});

export function formatTime(millis) {
  return millis ? formatTimeInternal(new Date(millis)) : null;
}

export function formatTimeWithoutSeconds(millis) {
  return millis ? formatTimeWithoutSecondsInternal(new Date(millis)) : null;
}

export function formatDate(millis) {
  return millis ? formatDateInternal(new Date(millis)) : null;
}

export function formatDateShort(millis) {
  return millis ? formatDateShortInternal(new Date(millis)) : null;
}

export function formatDateTime(millis) {
  if (!millis) {
    return null;
  }
  const date = new Date(millis);
  return `${formatDateInternal(date)} ${formatTimeInternal(date)}`;
}

export function fromNow(millis) {
  return moment(millis).fromNow();
}

export function formatDuration(millis) {
  return moment.duration(millis).humanize();
}

// 30.38 days per average per month
export const daysPerMonth = 30.38;
const times = [
  {
    long: 'year',
    short: 'y',
    millis: 12 * daysPerMonth * 24 * 60 * 60 * 1000
  },
  {
    long: 'month',
    short: 'mo',
    millis: daysPerMonth * 24 * 60 * 60 * 1000
  },
  {
    long: 'day',
    short: 'd',
    millis: 24 * 60 * 60 * 1000
  },
  {
    long: 'hour',
    short: 'h',
    millis: 60 * 60 * 1000
  },
  {
    long: 'minute',
    short: 'm',
    millis: 60 * 1000
  },
  {
    long: 'second',
    short: 's',
    millis: 1000
  }
];

export function fromNowAccurately(millis, ignoreTimesSmallerThan) {
  return formatDurationAccurately(Math.abs(Date.now() - millis), ignoreTimesSmallerThan);
}

export function formatDurationAccurately(millis, ignoreTimesSmallerThan = 60000, useShort = true) {
  let result = '';

  for (let i = 0; i < times.length; i++) {
    if (millis < ignoreTimesSmallerThan) {
      continue;
    }

    const time = times[i];
    const count = Math.floor(millis / time.millis);
    millis = millis - count * time.millis;

    if (count > 0) {
      // 1day, 2days, 1year, 10 years, ...
      if (useShort) {
        result = `${result} ${count}${time.short}`;
      } else {
        const append = count === 1 ? '' : 's';
        result = `${result} ${count} ${time.long}${append}`;
      }
    }
  }

  if (result === '') {
    return `${millis}ms`;
  }

  return result.trim();
}

export function formatDurationRaw(millis) {
  const duration = moment.duration(millis);
  return moment({
    hour: duration.hours(),
    minute: duration.minutes(),
    second: duration.seconds()
  }).format(timeFormat);
}

function formatTimeInternalAccordingToLocalTime(date) {
  const hours = ensureTwoChars(date.getHours());
  const minutes = ensureTwoChars(date.getMinutes());
  const seconds = ensureTwoChars(date.getSeconds());
  return `${hours}:${minutes}:${seconds}`;
}

function formatTimeWithoutSecondsInternalAccordingToLocalTime(date) {
  const hours = ensureTwoChars(date.getHours());
  const minutes = ensureTwoChars(date.getMinutes());
  return `${hours}:${minutes}`;
}

function formatDateInternalAccordingToLocalTime(date) {
  const year = date.getFullYear();
  const month = ensureTwoChars(date.getMonth() + 1);
  const day = ensureTwoChars(date.getDate());
  return `${year}-${month}-${day}`;
}

function formatDateShortInternalAccordingToLocalTime(date) {
  const month = monthsShort[date.getMonth()];
  const day = ensureTwoChars(date.getDate());
  return `${month} ${day}`;
}

function formatTimeInternalAccordingToUTC(date) {
  const hours = ensureTwoChars(date.getUTCHours());
  const minutes = ensureTwoChars(date.getUTCMinutes());
  const seconds = ensureTwoChars(date.getUTCSeconds());
  return `${hours}:${minutes}:${seconds}`;
}

function formatTimeWithoutSecondsInternalAccordingToUTC(date) {
  const hours = ensureTwoChars(date.getUTCHours());
  const minutes = ensureTwoChars(date.getUTCMinutes());
  return `${hours}:${minutes}`;
}

function formatDateInternalAccordingToUTC(date) {
  const year = date.getUTCFullYear();
  const month = ensureTwoChars(date.getUTCMonth() + 1);
  const day = ensureTwoChars(date.getUTCDate());
  return `${year}-${month}-${day}`;
}

function formatDateShortInternalAccordingToUtc(date) {
  const month = monthsShort[date.getUTCMonth()];
  const day = ensureTwoChars(date.getUTCDate());
  return `${month} ${day}`;
}

function ensureTwoChars(s) {
  if (s < 10) {
    return `0${s}`;
  }
  return s;
}

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

export function parseTime(timeString) {
  return parseTimeInternal(timeString);
}

function parseTimeAsUtc(timeString) {
  return moment.utc(timeString, timeFormat).toDate();
}

function parseTimeAccordingToLocalTime(timeString) {
  return moment(timeString, timeFormat).toDate();
}

export function mergeDates(date, time) {
  const dateTime = new Date();
  dateTime.setFullYear(date.getFullYear());
  dateTime.setMonth(date.getMonth());
  dateTime.setDate(date.getDate());
  dateTime.setHours(time.getHours());
  dateTime.setMinutes(time.getMinutes());
  dateTime.setSeconds(time.getSeconds());
  return dateTime;
}
