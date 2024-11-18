/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { FormatterFn } from 'in-stores/metric/formatters';
import { ConversionFn } from 'in-stores/metric/units';
import { Nullish } from 'in-types';

export interface Bucket {
  from: number | string | Nullish;
  to: number | string | Nullish;
  calls: number;
  tickMark?: boolean;
  group?: string;
}

export interface Formatter {
  type: string;
  applyFormatter: FormatterFn;
}

export interface Converter {
  unit: string;
  conversionFn: ConversionFn;
}
