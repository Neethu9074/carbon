/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { getIntlDateFormatter } from '@instana/format-date';

// @ts-ignore
// eslint-disable-next-line no-restricted-imports
import moment from 'in-services/moment-timezone';
import { compareIgnoreCase } from 'in-services/util/string';
import { compare } from 'in-services/util/number';

export interface TimezoneOption {
  name: string;
  offset: number;
  formattedOffset: string;
}

export interface ComboBoxOption {
  label: string;
  value: string;
}

export const getFormattedTimeZone = () => {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const offset = moment.tz(tz).format('Z');
  return `UTC${offset} ${tz}`;
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
    label: `UTC ${formattedOffset} - ${name}`,
    value: `UTC ${formattedOffset} - ${name}`
  }));

export const extractTimeZoneName = (timezone: string): string => {
  const parts = timezone.split(' - ');
  return parts[parts.length - 1] || '';
};
