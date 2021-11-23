/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import {
  number,
  bytes,
  percentage,
  millis,
  seconds,
  micros,
  latency,
  NumberFormatter,
  FormatterType
} from 'in-services/formatters/number';

interface FormatterWithDefault {
  (v: number): any;
  compact: (v: number) => string;
  detailed: (v: number) => string;
}

const mappings: { readonly [key in FormatterType]?: FormatterWithDefault } = {
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

export function getFormatter(backendType: FormatterType) {
  return mappings[backendType] ?? mappings.NUMBER;
}

function createFormatterWithDefault<T extends NumberFormatter>(formatters: T, preferred: string): FormatterWithDefault {
  const result = (v: number) => (formatters as any)[preferred](v);
  result.compact = (formatters as any).compact;
  result.detailed = (formatters as any).detailed;
  return result;
}

// BEFORE YOU EXTEND THIS!
// Consider that adding more formatters will mean additional formatters
// that end-users can select. In some cases this may cause quite some
// confusion, especially if users have no idea whether the source data
// is millis, micros, nanos, seconds, minutes…
// Consider cleaning this up for users instead of exposing them to our
// failure to consistently model the data.
const mappingsToUiInternalNames: { readonly [key in FormatterType]?: string } = {
  NUMBER: 'number.compact',
  PERCENTAGE: 'percentage.detailed',
  BYTES: 'bytes.detailed',
  MILLIS: 'millis.compact',
  LATENCY: 'latency.detailed'
};

export function getUiInternalFormatterName(backendType: FormatterType) {
  return mappingsToUiInternalNames[backendType] || 'number.detailed';
}
