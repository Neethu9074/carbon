/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { formatDateShort, formatTime, formatTimeWithoutSeconds, getIntlDateFormatter } from '@instana/format-date';

import { DATE_FORMAT, DATE_TIME_FORMAT, SHORT_DATE_FORMAT, TIME_FORMAT, utcLabel } from 'in-service-levels/constants';
// @ts-ignore
// eslint-disable-next-line no-restricted-imports
import moment from 'in-services/moment-timezone';
import { compareIgnoreCase } from 'in-services/util/string';
import { formatDate } from 'in-services/formatters/date';
import { compare } from 'in-services/util/number';

export interface ComboBoxOption {
  label: string;
  value: string;
}

interface TimezoneOption {
  name: string;
  offset: number;
  formattedOffset: string;
}

const buildTimeZoneString = (formattedOffset: string, currentZone: string) =>
  `${utcLabel}${formattedOffset} - ${currentZone}`;

export const getCurrentFormattedTimezone = (): string => {
  const currentZone = moment.tz.guess();
  const timezone = moment.tz(currentZone);
  const formattedOffset = timezone.format('Z');
  return buildTimeZoneString(formattedOffset, currentZone);
};

function isSupportedTimezone(timezone: string): boolean {
  try {
    getIntlDateFormatter({
      timeZone: timezone,
      hour12: false,
      hour: 'numeric',
      minute: 'numeric'
    });
    return true;
  } catch (e) {
    return false;
  }
}

export const formattedTimezoneList: ComboBoxOption[] = moment.tz
  .names()
  .filter(isSupportedTimezone)
  .map((name: string) => {
    const timezone = moment.tz(name);
    return {
      name,
      offset: timezone.utcOffset(),
      formattedOffset: timezone.format('Z')
    };
  })
  .sort((a: TimezoneOption, b: TimezoneOption) => {
    let result = compare(a.offset, b.offset);
    if (result === 0) {
      result = compareIgnoreCase(a.name, b.name);
    }
    return result;
  })
  .map(({ name, formattedOffset }: TimezoneOption) => ({
    label: buildTimeZoneString(formattedOffset, name),
    value: buildTimeZoneString(formattedOffset, name)
  }));

export const extractTimeZoneName = (timezone: string): string => {
  const parts = timezone.split(' - ');
  return parts[parts.length - 1] || '';
};

export const buildTimezoneFromLocationName = (timezoneName: string): string => {
  if (!timezoneName || timezoneName === utcLabel) {
    return utcLabel;
  }

  const timezoneMoment = moment.tz(timezoneName);
  const offset = timezoneMoment.format('Z');
  return buildTimeZoneString(offset, timezoneName);
};

export const convertToTimestampInTimezone = (date: string, time: string, timezone: string): number => {
  const dateTimeString = `${date} ${time}`;
  return moment.tz(dateTimeString, DATE_TIME_FORMAT, timezone).valueOf();
};

const formatWithTimezone = (timestamp: number, format: string, timezone?: string): string => {
  return timezone ? moment.tz(timestamp, timezone).format(format) : '';
};

export const formatDateInTimezone = (timestamp: number, timezone?: string): string => {
  return timezone ? formatWithTimezone(timestamp, DATE_FORMAT, timezone) : formatDate(timestamp) || '';
};

export const formatTimeInTimezone = (timestamp: number, timezone?: string): string => {
  return timezone ? formatWithTimezone(timestamp, TIME_FORMAT, timezone) : formatTime(timestamp) || '';
};

export const formatDateShortInTimezone = (timestamp: number, timezone?: string): string => {
  return timezone ? formatWithTimezone(timestamp, SHORT_DATE_FORMAT, timezone) : formatDateShort(timestamp) || '';
};

export const formatTimeShortWithoutSecondsInTimezone = (timestamp: number, timezone?: string): string => {
  return timezone ? formatWithTimezone(timestamp, TIME_FORMAT, timezone) : formatTimeWithoutSeconds(timestamp) || '';
};
