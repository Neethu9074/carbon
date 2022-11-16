/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { LogGroupItem } from '@instana/types';

export function getMetric({ numberOfLogs }: LogGroupItem) {
  return numberOfLogs;
}

export function getLabel({ label }: LogGroupItem) {
  return label;
}

export const defaultChartedMetrics = [{ metricId: 'logs_distribution', aggregationId: 'SUM' }];
