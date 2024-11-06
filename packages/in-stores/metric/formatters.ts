/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  bytes,
  siBytes,
  fourDecimalPlaces,
  latency,
  millis,
  number,
  percentage,
  siPrefix,
  percentagePlain
} from 'in-services/formatters/number';
import { t } from 'in-i18n';

export type FormatterFn = (n: number) => string | undefined | null;

export interface Formatter {
  id: string;
  label: string;
  formatter: FormatterFn;
  unitConversion: boolean;
}

export const defaultFormatter: Formatter = {
  id: 'number.detailed',
  label: t('in-stores:metric.formatterLabelNumber', { example: number.detailed(42.15) }),
  formatter: number.detailed,
  unitConversion: false
};

export const numberCompact: Formatter = {
  id: 'number.compact',
  label: t('in-stores:metric.formatterLabelNumber', { example: number.compact(42.15) }),
  formatter: number.compact,
  unitConversion: false
};
export const percentageCompact: Formatter = {
  id: 'percentage.compact',
  label: t('in-stores:metric.formatterLabelPercentage', { example: percentage.compact(0.4215) }),
  formatter: percentage.compact,
  unitConversion: false
};
export const percentageDetailed: Formatter = {
  id: 'percentage.detailed',
  label: t('in-stores:metric.formatterLabelPercentage', { example: percentage.detailed(0.4215) }),
  formatter: percentage.detailed,
  unitConversion: false
};
export const percentagePlainDetailed: Formatter = {
  id: 'percentagePlain.detailed',
  label: t('in-stores:metric.formatterLabelPercentage', { example: percentagePlain.detailed(0.4215) }),
  formatter: percentagePlain.detailed,
  unitConversion: false
};
export const bytesCompact: Formatter = {
  id: 'bytes.compact',
  label: t('in-stores:metric.formatterLabelBytes', { example: bytes.compact(3146340) }),
  formatter: bytes.compact,
  unitConversion: true
};
export const bytesDetailed: Formatter = {
  id: 'bytes.detailed',
  label: t('in-stores:metric.formatterLabelBytes', { example: bytes.detailed(3146340) }),
  formatter: bytes.detailed,
  unitConversion: true
};
export const siBytesCompact: Formatter = {
  id: 'siBytes.compact',
  label: t('in-stores:metric.formatterLabelBytes', { example: siBytes.compact(3146340) }),
  formatter: siBytes.compact,
  unitConversion: true
};
export const siBytesDetailed: Formatter = {
  id: 'siBytes.detailed',
  label: t('in-stores:metric.formatterLabelBytes', { example: siBytes.detailed(3146340) }),
  formatter: siBytes.detailed,
  unitConversion: true
};
export const millisCompact: Formatter = {
  id: 'millis.compact',
  label: t('in-stores:metric.formatterLabelMilliseconds', { example: millis.compact(42.15) }),
  formatter: millis.compact,
  unitConversion: true
};
export const millisDetailed: Formatter = {
  id: 'millis.detailed',
  label: t('in-stores:metric.formatterLabelMilliseconds', { example: millis.detailed(42.15) }),
  formatter: millis.detailed,
  unitConversion: true
};
export const latencyDetailed: Formatter = {
  id: 'latency.detailed',
  label: t('in-stores:metric.formatterLabelLatency', { example: latency.detailed(0) }),
  formatter: latency.detailed,
  unitConversion: true
};
export const siPrefixCompact: Formatter = {
  id: 'siPrefix.compact',
  label: t('in-stores:metric.formatterLabelSIPrefix', { example: siPrefix.compact(3146340) }),
  formatter: siPrefix.compact,
  unitConversion: true
};
export const siPrefixDetailed: Formatter = {
  id: 'siPrefix.detailed',
  label: t('in-stores:metric.formatterLabelSIPrefix', { example: siPrefix.detailed(3146340) }),
  formatter: siPrefix.detailed,
  unitConversion: true
};
export const fourDecimalPlacesDetailed: Formatter = {
  id: 'fourDecimalPlaces.detailed',
  label: t('in-stores:metric.formatterLabelNumber', { example: fourDecimalPlaces(42.15) }),
  formatter: fourDecimalPlaces,
  unitConversion: true
};
export const perSecondDetailed: Formatter = {
  id: 'perSecond.detailed',
  label: t('in-stores:metric.formatterLabelNumber', { example: number.perSecond.detailed(42.15) }),
  formatter: number.perSecond.detailed,
  unitConversion: true
};

// BEFORE YOU EXTEND THIS!
// Consider that adding more formatters will mean additional formatters
// that end-users can select. In some cases this may cause quite some
// confusion, especially if users have no idea whether the source data
// is millis, micros, nanos, seconds, minutes…
// Consider cleaning this up for users instead of exposing them to our
// failure to consistently model the data.
export const publicFormatters: Formatter[] = [
  numberCompact,
  defaultFormatter,
  percentageCompact,
  percentageDetailed,
  bytesCompact,
  bytesDetailed,
  siBytesCompact,
  siBytesDetailed,
  millisCompact,
  millisDetailed,
  latencyDetailed,
  siPrefixCompact,
  siPrefixDetailed
];

// These formatters should not be selectable by end-users.
const privateFormatters: Formatter[] = [fourDecimalPlacesDetailed, perSecondDetailed, percentagePlainDetailed];

const allFormatters: Formatter[] = [...publicFormatters, ...privateFormatters];

export const publicFormatterIds = Object.values(publicFormatters).map(c => c.id);
export const allFormatterIds = Object.values(allFormatters).map(c => c.id);

export function getFormatter(formatterId?: string): FormatterFn {
  return (getFormatterById(formatterId) || defaultFormatter).formatter;
}

export function getFormatterId(formatterFn?: FormatterFn): string {
  return getFormatterIdByFn(formatterFn) || defaultFormatter.id;
}

export function getFormatterUnitConversion(formatterId?: string): boolean {
  return (getFormatterById(formatterId) || defaultFormatter).unitConversion;
}

export function getFormatterById(formatterId?: string): Formatter | undefined {
  return allFormatters.find(({ id }) => id === formatterId);
}

export function getFormatterIdByFn(formatterFn?: FormatterFn): string | undefined {
  return allFormatters.find(({ formatter }) => formatter === formatterFn)?.id;
}
