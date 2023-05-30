/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MetricDataSeries } from 'in-components/Chart/types';

export function findMinMetricValue(metrics: MetricDataSeries): number {
  return metrics.reduce((acc, [, value]) => {
    return Math.min(acc, value);
  }, 0);
}
