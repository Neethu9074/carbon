/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { BackendFormatterType } from 'in-services/formatters/backendFormatter';
import { FormatterFn, getFormatterId } from 'in-stores/metric/formatters';
import { t } from 'in-i18n';

type UnitsMapping = { [value: string]: Unit };
export type ConversionFn = (n: number) => number;
export type BaseUnit = 'TIME' | 'SIZE' | 'NUMBER' | 'PERCENTAGE' | 'RATE';

export const bitsBase = 8;
export const bytesBase = 1000;
export const millisBase = 1000;

const NO_CONVERSION: ConversionFn = input => input;

export interface Unit {
  id: string;
  label: string;
  baseUnit: BaseUnit;
  converter: ConversionFn;
}

export const number: Unit = {
  id: 'number',
  label: t('in-stores:metric.unit_number'),
  baseUnit: 'NUMBER',
  converter: NO_CONVERSION
};

export const percentage: Unit = {
  id: 'percentage',
  label: t('in-stores:metric.unit_percentage'),
  baseUnit: 'PERCENTAGE',
  converter: NO_CONVERSION
};

export const percentage100: Unit = {
  id: 'percentage100',
  label: t('in-stores:metric.unit_percentage_100'),
  baseUnit: 'PERCENTAGE',
  converter: n => n / 100
};

export const bits: Unit = {
  id: 'bits',
  label: t('in-stores:metric.unit_bits'),
  baseUnit: 'SIZE',
  converter: bit => bit / bitsBase
};

export const byte: Unit = {
  id: 'byte',
  label: t('in-stores:metric.unit_byte'),
  baseUnit: 'SIZE',
  converter: NO_CONVERSION
};

export const kiloByte: Unit = {
  id: 'kilobyte',
  label: t('in-stores:metric.unit_kilobyte'),
  baseUnit: 'SIZE',
  converter: kb => kb * bytesBase
};

export const megaByte: Unit = {
  id: 'megabyte',
  label: t('in-stores:metric.unit_megabyte'),
  baseUnit: 'SIZE',
  converter: mb => kiloByte.converter(mb * bytesBase)
};

export const gigaByte: Unit = {
  id: 'gigabyte',
  label: t('in-stores:metric.unit_gigabyte'),
  baseUnit: 'SIZE',
  converter: gb => megaByte.converter(gb * bytesBase)
};

export const microSecond: Unit = {
  id: 'microsecond',
  label: t('in-stores:metric.unit_microsecond'),
  baseUnit: 'TIME',
  converter: ms => ms / millisBase
};

export const miliSecond: Unit = {
  id: 'milisecond',
  label: t('in-stores:metric.unit_milisecond'),
  baseUnit: 'TIME',
  converter: NO_CONVERSION
};

export const second: Unit = {
  id: 'second',
  label: t('in-stores:metric.unit_second'),
  baseUnit: 'TIME',
  converter: s => s * millisBase
};

export const perSecond: Unit = {
  id: 'persecond',
  label: t('in-stores:metric.unit_persecond'),
  baseUnit: 'RATE',
  converter: NO_CONVERSION
};

export const allUnits: UnitsMapping = {
  number: number,
  percentage: percentage,
  percentage100: percentage100,
  bits: bits,
  byte: byte,
  kilobyte: kiloByte,
  megabyte: megaByte,
  gigabyte: gigaByte,
  microsecond: microSecond,
  milisecond: miliSecond,
  second: second,
  persecond: perSecond
};

export const unitsByFormatter: UnitsMapping = {
  'number.compact': number,
  'number.detailed': number,
  'percentage.compact': percentage,
  'percentage.detailed': percentage,
  'percentagePlain.detailed': percentage100,
  'bytes.compact': byte,
  'bytes.detailed': byte,
  'millis.compact': miliSecond,
  'millis.detailed': miliSecond,
  'perSecond.detailed': perSecond
};

export function getUnit(value: string): Unit {
  return allUnits[value];
}

export function getBaseUnit(value: string): BaseUnit {
  return getUnit(value)?.baseUnit;
}

export function getUnitByFormatter(formatter: string): Unit {
  return unitsByFormatter[formatter];
}

export function getUnitByFormatterFn(formatter: FormatterFn): Unit {
  return getUnitByFormatter(getFormatterId(formatter));
}

export function getMetricUnitByBackendType(backendType?: BackendFormatterType): Unit | undefined {
  switch (backendType) {
    case 'NUMBER':
      return number;
    case 'PERCENTAGE':
      return percentage;
    case 'PERCENTAGE_100':
      return percentage100;
    case 'BYTES':
      return byte;
    case 'KILO_BYTES':
      return kiloByte;
    case 'MEGA_BYTES':
      return megaByte;
    case 'MICROS':
      return microSecond;
    case 'MILLIS':
    case 'LATENCY':
    case 'LATENCY_WITH_DECIMALS':
      return miliSecond;
    case 'SECONDS':
      return second;
    case 'RATE':
    case 'BYTE_RATE':
      return perSecond;
    default:
      return undefined;
  }
}
