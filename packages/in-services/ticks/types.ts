/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { FormatterFn } from 'in-stores/metric/formatters';
import { ScaleType } from 'in-services/scale';

export interface Tick {
  range: number;
  domain: number;
}

export interface TickRequest {
  scale: ScaleType;
  formatter?: FormatterFn;
  numIntermediateSteps?: number;
}
