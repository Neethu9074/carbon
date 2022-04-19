/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { parse, isValid } from 'date-fns';

import { formatDateWithActiveLanguage } from 'in-services/formatters/dateFnsFormatWrapper';

export type TimeFormat = 'HH:mm' | 'HH:mm:ss';

export const withLeadingZeros = (value: string | number) => {
  return String(value)
    .slice(0, 2)
    .padStart(2, '0');
};

export function fillMissingInputTime(input: string, timeFormat: TimeFormat): string {
  const strings = input.split(':');

  return timeFormat
    .split(':')
    .map((_v, index) => withLeadingZeros(strings[index] ?? ''))
    .join(':');
}

export default function formatInputTime(input: string, timeFormat: TimeFormat): string {
  const enrichedTime = fillMissingInputTime(input, timeFormat);
  const date = parse(enrichedTime, timeFormat, new Date());

  if (isValid(date)) {
    return formatDateWithActiveLanguage(date, timeFormat);
  } else {
    return input;
  }
}
