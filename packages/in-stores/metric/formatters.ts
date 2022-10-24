/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { bytes, fourDecimalPlaces, latency, millis, number, percentage, siPrefix } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export type FormatterFn = (n: number) => string | undefined | null;

export interface Formatter {
  id: string;
  label: string;
  formatter: FormatterFn;
}

export const defaultFormatter: Formatter = {
  id: 'number.detailed',
  label: t('in-stores:metric.formatterLabelNumber', { example: number.detailed(42.15) }),
  formatter: number.detailed
};

export const numberCompact: Formatter = {
  id: 'number.compact',
  label: t('in-stores:metric.formatterLabelNumber', { example: number.compact(42.15) }),
  formatter: number.compact
};
export const percentageCompact: Formatter = {
  id: 'percentage.compact',
  label: t('in-stores:metric.formatterLabelPercentage', { example: percentage.compact(0.4215) }),
  formatter: percentage.compact
};
export const percentageDetailed: Formatter = {
  id: 'percentage.detailed',
  label: t('in-stores:metric.formatterLabelPercentage', { example: percentage.detailed(0.4215) }),
  formatter: percentage.detailed
};
export const bytesCompact: Formatter = {
  id: 'bytes.compact',
  label: t('in-stores:metric.formatterLabelBytes', { example: bytes.compact(3146340) }),
  formatter: bytes.compact
};
export const bytesDetailed: Formatter = {
  id: 'bytes.detailed',
  label: t('in-stores:metric.formatterLabelBytes', { example: bytes.detailed(3146340) }),
  formatter: bytes.detailed
};
export const millisCompact: Formatter = {
  id: 'millis.compact',
  label: t('in-stores:metric.formatterLabelMilliseconds', { example: millis.compact(42.15) }),
  formatter: millis.compact
};
export const millisDetailed: Formatter = {
  id: 'millis.detailed',
  label: t('in-stores:metric.formatterLabelMilliseconds', { example: millis.detailed(42.15) }),
  formatter: millis.detailed
};
export const latencyDetailed: Formatter = {
  id: 'latency.detailed',
  label: t('in-stores:metric.formatterLabelLatency', { example: latency.detailed(0) }),
  formatter: latency.detailed
};
export const siPrefixCompact: Formatter = {
  id: 'siPrefix.compact',
  label: t('in-stores:metric.formatterLabelSIPrefix', { example: siPrefix.compact(3146340) }),
  formatter: siPrefix.compact
};
export const siPrefixDetailed: Formatter = {
  id: 'siPrefix.detailed',
  label: t('in-stores:metric.formatterLabelSIPrefix', { example: siPrefix.detailed(3146340) }),
  formatter: siPrefix.detailed
};
export const fourDecimalPlacesDetailed: Formatter = {
  id: 'fourDecimalPlaces.detailed',
  label: t('in-stores:metric.formatterLabelNumber', { example: fourDecimalPlaces(42.15) }),
  formatter: fourDecimalPlaces
};
export const perSecondDetailed: Formatter = {
  id: 'perSecond.detailed',
  label: t('in-stores:metric.formatterLabelNumber', { example: number.perSecond.detailed(42.15) }),
  formatter: number.perSecond.detailed
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
  millisCompact,
  millisDetailed,
  latencyDetailed,
  siPrefixCompact,
  siPrefixDetailed
];

// These formatters should not be selectable by end-users.
const privateFormatters: Formatter[] = [fourDecimalPlacesDetailed, perSecondDetailed];

const allFormatters: Formatter[] = [...publicFormatters, ...privateFormatters];

export const publicFormatterIds = Object.values(publicFormatters).map(c => c.id);
export const allFormatterIds = Object.values(allFormatters).map(c => c.id);

export function getFormatter(formatterId?: string): FormatterFn {
  return (allFormatters.find(({ id }) => id === formatterId) || defaultFormatter).formatter;
}
