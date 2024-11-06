/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

const markStorageLocation = '__instanaFormatterType';

export type FormatterType =
  | 'BYTE_RATE'
  | 'BYTES'
  | 'SI_BYTES'
  | 'KILO_BYTES'
  | 'LATENCY'
  | 'MEGA_BYTES'
  | 'NANOS'
  | 'MICROS'
  | 'MILLIS'
  | 'MINUTES'
  | 'NUMBER'
  | 'PERCENTAGE'
  | 'PERCENTAGE_100'
  | 'RATE'
  | 'SECONDS'
  | 'UNDEFINED';

export type NumberFormatterFunction = (...args: any) => string;
export type NumberFormatterObject = {
  compact?: (...args: any) => string;
  detailed?: (...args: any) => string;
  short?: (...args: any) => string;

  // More properties may be defined, but we ignore them.
  [other: string]: any;
};
export type NumberFormatter = NumberFormatterFunction | NumberFormatterObject;

export const BYTE_RATE_FORMATTER_TYPE: FormatterType = 'BYTE_RATE';
export const BYTES_FORMATTER_TYPE: FormatterType = 'BYTES';
export const SI_BYTES_FORMATTER_TYPE: FormatterType = 'SI_BYTES';
export const KILO_BYTES_FORMATTER_TYPE: FormatterType = 'KILO_BYTES';
export const LATENCY_FORMATTER_TYPE: FormatterType = 'LATENCY';
export const MEGA_BYTES_FORMATTER_TYPE: FormatterType = 'MEGA_BYTES';
export const NANOS_FORMATTER_TYPE: FormatterType = 'NANOS';
export const MICROS_FORMATTER_TYPE: FormatterType = 'MICROS';
export const MILLIS_FORMATTER_TYPE: FormatterType = 'MILLIS';
export const MINUTES_FORMATTER_TYPE: FormatterType = 'MINUTES';
export const NUMBER_FORMATTER_TYPE: FormatterType = 'NUMBER';
export const PERCENTAGE_FORMATTER_TYPE: FormatterType = 'PERCENTAGE';
export const PERCENTAGE_100_FORMATTER_TYPE: FormatterType = 'PERCENTAGE_100';
export const RATE_FORMATTER_TYPE: FormatterType = 'RATE';
export const SECONDS_FORMATTER_TYPE: FormatterType = 'SECONDS';
export const UNDEFINED_FORMATTER_TYPE: FormatterType = 'UNDEFINED';

/**
 * Add a formatter type to either a formatter object (with compact/detailed) fields
 * or only on a formatter function. Can be called multiple times with the same
 * parameters without issues.
 */
export function markAsFormatterType<T extends NumberFormatter>(formatter: T, type: FormatterType): T {
  mark(formatter, type);
  mark((formatter as NumberFormatterObject).compact, type);
  mark((formatter as NumberFormatterObject).detailed, type);
  mark((formatter as NumberFormatterObject).short, type);
  return formatter;
}

function mark(obj: any, type: FormatterType) {
  if (!obj) {
    return;
  }

  const formatterTypes = (obj[markStorageLocation] = obj[markStorageLocation] || new Set());
  formatterTypes.add(type);
}

/**
 * Returns the first formatter type found or UNDEFINED_FORMATTER_TYPE.
 */
export function getFormatterType(formatter?: NumberFormatter): FormatterType {
  return (
    get(formatter) ||
    get((formatter as NumberFormatterObject)?.compact) ||
    get((formatter as NumberFormatterObject)?.short) ||
    get((formatter as NumberFormatterObject)?.detailed) ||
    UNDEFINED_FORMATTER_TYPE
  );
}

function get(obj: any): FormatterType | undefined {
  return obj?.[markStorageLocation]?.values()?.next()?.value;
}
