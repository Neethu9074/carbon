/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, percentage, bytes, millis, siPrefix } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export const defaultFormatter = {
  id: 'number.detailed',
  label: t('in-stores:metric.formatterLabelNumber', { example: number.detailed(42.15) }),
  formatter: number.detailed
};

// BEFORE YOU EXTEND THIS!
// Consider that adding more formatters will mean additional formatters
// that end-users can select. In some cases this may cause quite some
// confusion, especially if users have no idea whether the source data
// is millis, micros, nanos, seconds, minutes…
// Consider cleaning this up for users instead of exposing them to our
// failure to consistently model the data.
export const formatters = [
  {
    id: 'number.compact',
    label: t('in-stores:metric.formatterLabelNumber', { example: number.compact(42.15) }),
    formatter: number.compact
  },
  defaultFormatter,
  {
    id: 'percentage.compact',
    label: t('in-stores:metric.formatterLabelPercentage', { example: percentage.compact(0.4215) }),
    formatter: percentage.compact
  },
  {
    id: 'percentage.detailed',
    label: t('in-stores:metric.formatterLabelPercentage', { example: percentage.detailed(0.4215) }),
    formatter: percentage.detailed
  },
  {
    id: 'bytes.compact',
    label: t('in-stores:metric.formatterBytes', { example: bytes.compact(3146340) }),
    formatter: bytes.compact
  },
  {
    id: 'bytes.detailed',
    label: t('in-stores:metric.formatterBytes', { example: bytes.detailed(3146340) }),
    formatter: bytes.detailed
  },
  {
    id: 'millis.compact',
    label: t('in-stores:metric.formatterLabelMilliseconds', { example: millis.compact(42.15) }),
    formatter: millis.compact
  },
  {
    id: 'millis.detailed',
    label: t('in-stores:metric.formatterLabelMilliseconds', { example: millis.detailed(42.15) }),
    formatter: millis.detailed
  },
  {
    id: 'siPrefix.compact',
    label: t('in-stores:metric.formatterLabelSIPrefix', { example: siPrefix.compact(3146340) }),
    formatter: siPrefix.compact
  },
  {
    id: 'siPrefix.detailed',
    label: t('in-stores:metric.formatterLabelSIPrefix', { example: siPrefix.detailed(3146340) }),
    formatter: siPrefix.detailed
  }
];

export const allFormatterIds = Object.values(formatters).map(c => c.id);

export function getFormatter(formatterId) {
  return (formatters.find(({ id }) => id === formatterId) || defaultFormatter).formatter;
}
