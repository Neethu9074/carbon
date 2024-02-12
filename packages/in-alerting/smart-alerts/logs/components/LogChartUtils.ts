/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Granularity, LogAlertConfigWithMetadata, TagFilterExpressionElementUnion, TimeConfig } from '@instana/types';

import { createDefaultChartConfig } from 'in-alerting/components/Chart/chartViewConfig';
import { numberCompact } from 'in-stores/metric/formatters';
import { line } from 'in-stores/metric/renderer';

export function getUnifiedMetricConfig(
  metricId: string,
  tagFilterExpression: TagFilterExpressionElementUnion,
  granularity: Granularity
) {
  return {
    type: 'TIME_SERIES',
    granularity,
    y1: {
      formatter: numberCompact.id,
      min: 0,
      renderer: line.id,
      metrics: [
        {
          aggregation: 'SUM',
          metric: metricId,
          source: 'LOG',
          tagFilterExpression: tagFilterExpression,
          timeShift: 0
        }
      ]
    }
  };
}

export function getChartConfig(alertConfig: LogAlertConfigWithMetadata, timeConfig: TimeConfig, metricId: string) {
  const { threshold, granularity } = alertConfig;

  const chartViewConfig = createDefaultChartConfig(timeConfig);

  return {
    customHeight: 182,
    thresholdType: threshold.type,
    timeConfig: timeConfig,
    metricsConfiguration: {
      timeConfig: chartViewConfig.timeConfig,
      metrics: {
        [metricId]: {
          metric: metricId,
          granularity,
          aggregation: 'SUM'
        },
        ['violations']: {
          metric: 'violations',
          aggregation: undefined
        }
      }
    }
  };
}
