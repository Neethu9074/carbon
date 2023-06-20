/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Nullish } from 'in-types';

export interface Bucket {
  from: number | string | Nullish;
  to: number | string | Nullish;
  calls: number;
  tickMark?: boolean;
}
