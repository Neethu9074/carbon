/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

const markStorageLocation = '__instanaFormatterType';

type FormatterType =
  | 'BYTE_RATE'
  | 'BYTES'
  | 'KILO_BYTES'
  | 'LATENCY'
  | 'MEGA_BYTES'
  | 'MICROS'
  | 'MILLIS'
  | 'NUMBER'
  | 'PERCENTAGE'
  | 'RATE'
  | 'SECONDS'
  | 'UNDEFINED';

type NumberFormatter =
  | ((...args: any) => string)
  | {
      compact: (...args: any) => string;
      detailed: (...args: any) => string;
    };

export const BYTE_RATE_FORMATTER_TYPE: FormatterType = 'BYTE_RATE';
export const BYTES_FORMATTER_TYPE: FormatterType = 'BYTES';
export const KILO_BYTES_FORMATTER_TYPE: FormatterType = 'KILO_BYTES';
export const LATENCY_FORMATTER_TYPE: FormatterType = 'LATENCY';
export const MEGA_BYTES_FORMATTER_TYPE: FormatterType = 'MEGA_BYTES';
export const MICROS_FORMATTER_TYPE: FormatterType = 'MICROS';
export const MILLIS_FORMATTER_TYPE: FormatterType = 'MILLIS';
export const NUMBER_FORMATTER_TYPE: FormatterType = 'NUMBER';
export const PERCENTAGE_FORMATTER_TYPE: FormatterType = 'PERCENTAGE';
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
  mark((formatter as any).compact, type);
  mark((formatter as any).detailed, type);
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
    get(formatter) || get((formatter as any)?.compact) || get((formatter as any)?.detailed) || UNDEFINED_FORMATTER_TYPE
  );
}

function get(obj: any): FormatterType | undefined {
  return obj?.[markStorageLocation]?.values()?.next()?.value;
}
