/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import {
  LogGroupItem,
  LogItem,
  TagFilterExpression,
  TagFilterExpressionElementUnion,
  TimeConfig
} from '@instana/types';

// eslint-disable-next-line no-restricted-imports
import { logsCallwithFilters } from '../tracker';

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

export const handleLogCallsWithFilters = (payload: {
  timeConfig: TimeConfig;
  tagFilterExpression: TagFilterExpression | TagFilterExpressionElementUnion;
}) => {
  logsCallwithFilters(payload);
};
