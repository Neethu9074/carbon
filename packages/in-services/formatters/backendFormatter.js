/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { number, bytes, percentage, millis, seconds, micros, latency } from 'in-services/formatters/number';

const mappings = {
  NUMBER: createFormatterWithDefault(number, 'compact'),
  RATE: createFormatterWithDefault(number.perSecond, 'detailed'),

  PERCENTAGE: createFormatterWithDefault(percentage, 'detailed'),

  BYTES: createFormatterWithDefault(bytes, 'detailed'),
  BYTE_RATE: createFormatterWithDefault(bytes.perSecond, 'detailed'),

  LATENCY: createFormatterWithDefault(latency, 'compact'),

  MICROS: createFormatterWithDefault(micros, 'compact'),
  MILLIS: createFormatterWithDefault(millis, 'compact'),
  SECONDS: createFormatterWithDefault(seconds, 'fixedCompact')
};

export function getFormatter(backendType) {
  return mappings[backendType] ?? mappings.NUMBER;
}

function createFormatterWithDefault(formatters, preferred) {
  const result = v => formatters[preferred](v);
  result.compact = formatters.compact;
  result.detailed = formatters.detailed;
  return result;
}

// BEFORE YOU EXTEND THIS!
// Consider that adding more formatters will mean additional formatters
// that end-users can select. In some cases this may cause quite some
// confusion, especially if users have no idea whether the source data
// is millis, micros, nanos, seconds, minutes…
// Consider cleaning this up for users instead of exposing them to our
// failure to consistently model the data.
const mappingsToUiInternalNames = {
  NUMBER: 'number.compact',
  PERCENTAGE: 'percentage.detailed',
  BYTES: 'bytes.detailed',
  MILLIS: 'millis.compact'
};

export function getUiInternalFormatterName(backendType) {
  return mappingsToUiInternalNames[backendType] || 'number.detailed';
}
