/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import {
  LogGroupItem,
  LogItem,
  TagFilter,
  TagFilterExpression,
  TagFilterExpressionElementUnion,
  TimeConfig
} from '@instana/types';

// eslint-disable-next-line no-restricted-imports
import { ANALYZE_LOGGING_LOG_GETLOGS_FILTERS } from 'in-services/tracking/eventNames';
import { CtaTrackingFunction } from 'in-services/tracking/useSegmentTracking';

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

export const handleLogCallsWithFilters = (
  trackCta: CtaTrackingFunction,
  {
    timeConfig,
    tagFilterExpression
  }: {
    timeConfig: TimeConfig;
    tagFilterExpression: TagFilterExpression | TagFilterExpressionElementUnion;
  }
) => {
  trackCta(ANALYZE_LOGGING_LOG_GETLOGS_FILTERS, {
    timeConfig,
    tags: extractTagNames(tagFilterExpression)
  });
};

export function extractTagNames(expression: TagFilterExpressionElementUnion): string[] {
  const tagNames: string[] = [];

  if (expression.type === 'TAG_FILTER') {
    tagNames.push((expression as TagFilter).name);
  } else if (expression.type === 'EXPRESSION') {
    (expression as TagFilterExpression).elements.forEach(element => {
      tagNames.push(...extractTagNames(element));
    });
  }

  return [...new Set(tagNames)];
}
