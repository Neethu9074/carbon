/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { LogGroupItem, LogItem } from '@instana/types';

export function getMetric({ numberOfLogs }: LogGroupItem) {
  return numberOfLogs;
}

export function getLabel({ label }: LogGroupItem) {
  return label;
}

export function isLogItem(log: any): log is LogItem {
  if (!log) return false;
  return 'tags' in log && 'itemId' in log && 'timestamp' in log && 'message' in log;
}
export const defaultChartedMetrics = [{ metricId: 'logs_distribution', aggregationId: 'SUM' }];
