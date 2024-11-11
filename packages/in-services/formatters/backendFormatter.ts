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
  kiloBytes,
  megaBytes,
  percentagePlain,
  nanos
} from 'in-services/formatters/number';

interface FormatterWithDefault {
  (v: number): unknown;
  compact: (v: number) => string;
  detailed: (v: number) => string;
  varying: (v: number) => string;
}

export type BackendFormatterType =
  | 'BYTE_RATE'
  | 'BYTES'
  | 'KILO_BYTES'
  | 'MEGA_BYTES'
  | 'LATENCY'
  | 'MICROS'
  | 'MILLIS'
  | 'NANOS'
  | 'NUMBER'
  | 'PERCENTAGE'
  | 'PERCENTAGE_100'
  | 'RATE'
  | 'SECONDS'
  | 'LATENCY_WITH_DECIMALS';

export type InternalFormatterTypes =
  | 'NUMBER'
  | 'PERCENTAGE'
  | 'PERCENTAGE_100'
  | 'BYTES'
  | 'MILLIS'
  | 'LATENCY'
  | 'MICROS'
  | 'NANOS'
  | 'RATE';

const mappings: {
  readonly [key in BackendFormatterType]: FormatterWithDefault;
} = {
  NUMBER: createFormatterWithDefault(number, 'compact'),
  RATE: createFormatterWithDefault(number.perSecond, 'detailed'),

  PERCENTAGE: createFormatterWithDefault(percentage, 'detailed'),
  PERCENTAGE_100: createFormatterWithDefault(percentagePlain, 'detailed'),

  BYTES: createFormatterWithDefault(bytes, 'detailed'),
  KILO_BYTES: createFormatterWithDefault(kiloBytes, 'detailed'),
  MEGA_BYTES: createFormatterWithDefault(megaBytes, 'detailed'),
  BYTE_RATE: createFormatterWithDefault(bytes.perSecond, 'detailed'),

  LATENCY: createFormatterWithDefault(latency, 'compact'),

  NANOS: createFormatterWithDefault(nanos, 'compact'),
  MICROS: createFormatterWithDefault(micros, 'compact'),
  MILLIS: createFormatterWithDefault(millis, 'compact'),
  SECONDS: createFormatterWithDefault(seconds, 'fixedCompact'),
  LATENCY_WITH_DECIMALS: createFormatterWithDefault(millis, 'varying')
};

export function getFormatter(backendType: BackendFormatterType): FormatterWithDefault {
  return mappings[backendType] ?? mappings.NUMBER;
}

function createFormatterWithDefault<T extends NumberFormatter>(
  formatters: Extract<T, { compact?: (v: number) => string; detailed?: (v: number) => string }>,
  preferred: 'compact' | 'detailed' | 'fixedCompact' | 'varying'
): FormatterWithDefault {
  const result = (v: number) => formatters[preferred](v);
  result.compact = formatters.compact;
  result.detailed = formatters.detailed;
  return result as FormatterWithDefault;
}

// BEFORE YOU EXTEND THIS!
// Consider that adding more formatters will mean additional formatters
// that end-users can select. In some cases this may cause quite some
// confusion, especially if users have no idea whether the source data
// is millis, micros, nanos, seconds, minutes…
// Consider cleaning this up for users instead of exposing them to our
// failure to consistently model the data.
const mappingsToUiInternalNames: {
  readonly [key in InternalFormatterTypes]?: string;
} = {
  NUMBER: 'number.compact',
  PERCENTAGE: 'percentage.detailed',
  PERCENTAGE_100: 'percentagePlain.detailed',
  BYTES: 'bytes.detailed',
  MILLIS: 'millis.compact',
  MICROS: 'micros.compact',
  NANOS: 'nanos.compact',
  LATENCY: 'latency.detailed',
  RATE: 'perSecond.detailed'
};

export function getUiInternalFormatterName(backendType: InternalFormatterTypes): string {
  return mappingsToUiInternalNames[backendType] || 'number.detailed';
}

export const mappingsBackendTypesToUiMetrics = {
  NUMBER: 'number.compact',
  RATE: 'perSecond.detailed',
  PERCENTAGE: 'percentage.detailed',
  PERCENTAGE_100: 'percentagePlain.detailed',
  BYTES: 'bytes.detailed',
  KILO_BYTES: 'kilobytes.detailed',
  MEGA_BYTES: 'megabytes.detailed',
  BYTE_RATE: 'perSecond.detailed',
  LATENCY: 'latency.detailed',
  MILLIS: 'millis.compact',
  MICROS: 'micros.compact',
  NANOS: 'nanos.compact',
  SECONDS: 'seconds.fixedCompact',
  LATENCY_WITH_DECIMALS: 'millis.compact'
} as const;

export function getUiMetricsValueByBackendType(backendType?: BackendFormatterType): string {
  if (!backendType) {
    return 'number.detailed';
  }

  return mappingsBackendTypesToUiMetrics[backendType] || 'number.detailed';
}
