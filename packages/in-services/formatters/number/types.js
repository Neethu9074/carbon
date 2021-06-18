/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

const markStorageLocation = '__instanaFormatterType';

export const BYTE_RATE_FORMATTER_TYPE = 'BYTE_RATE';
export const BYTES_FORMATTER_TYPE = 'BYTES';
export const KILO_BYTES_FORMATTER_TYPE = 'KILO_BYTES';
export const LATENCY_FORMATTER_TYPE = 'LATENCY';
export const MEGA_BYTES_FORMATTER_TYPE = 'MEGA_BYTES';
export const MICROS_FORMATTER_TYPE = 'MICROS';
export const MILLIS_FORMATTER_TYPE = 'MILLIS';
export const NUMBER_FORMATTER_TYPE = 'NUMBER';
export const PERCENTAGE_FORMATTER_TYPE = 'PERCENTAGE';
export const RATE_FORMATTER_TYPE = 'RATE';
export const SECONDS_FORMATTER_TYPE = 'SECONDS';
export const UNDEFINED_FORMATTER_TYPE = 'UNDEFINED';

/**
 * Add a formatter type to either a formatter object (with compact/detailed) fields
 * or only on a formatter function. Can be called multiple times with the same
 * parameters without issues.
 */
export function markAsFormatterType(formatter, type) {
  mark(formatter, type);
  mark(formatter.compact, type);
  mark(formatter.detailed, type);
  return formatter;
}

function mark(obj, type) {
  if (!obj) {
    return;
  }

  const formatterTypes = (obj[markStorageLocation] = obj[markStorageLocation] || new Set());
  formatterTypes.add(type);
}

/**
 * Returns the first formatter type found or UNDEFINED_FORMATTER_TYPE.
 */
export function getFormatterType(formatter) {
  return get(formatter) || get(formatter?.compact) || get(formatter?.detailed) || UNDEFINED_FORMATTER_TYPE;
}

function get(obj) {
  return obj?.[markStorageLocation]?.values()?.next()?.value || null;
}
