/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { number, bytes, percentage, millis, seconds, micros } from 'in-services/formatters/number';

const mappings = {
  NUMBER: createFormatterWithDefault(number, 'compact'),
  RATE: createFormatterWithDefault(number.perSecond, 'detailed'),

  PERCENTAGE: createFormatterWithDefault(percentage, 'compact'),

  BYTES: createFormatterWithDefault(bytes, 'detailed'),
  BYTE_RATE: createFormatterWithDefault(bytes.perSecond, 'detailed'),

  MICROS: createFormatterWithDefault(micros, 'compact'),
  MILLIS: createFormatterWithDefault(millis, 'compact'),
  SECONDS: createFormatterWithDefault(seconds, 'fixedCompact'),
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
