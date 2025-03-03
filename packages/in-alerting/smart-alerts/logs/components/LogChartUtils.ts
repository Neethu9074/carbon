/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Granularity, TagFilterExpressionElementUnion, TimeConfig } from '@instana/types';

import { LogSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/logs/form/logAlertConfigTypes';
import { createDefaultChartConfig } from 'in-alerting/components/Chart/chartViewConfig';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { numberCompact } from 'in-stores/metric/formatters';
import { line } from 'in-stores/metric/renderer';
import { minutes } from 'in-services/time';
import { LogGroupItem } from 'in-types';

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

export function getChartConfig(alertConfig: LogSmartAlertConfigWithMetadata, timeConfig: TimeConfig, metricId: string) {
  const { granularity } = alertConfig;

  const chartViewConfig = createDefaultChartConfig(timeConfig);

  return {
    customHeight: 182,
    thresholdType: STATIC_THRESHOLD,
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
        },
        warningThreshold: {
          metric: 'warningThreshold'
        },
        criticalThreshold: {
          metric: 'criticalThreshold'
        }
      }
    }
  };
}

export const chartTimeConfig = {
  autoRefresh: false,
  to: Date.now(),
  focusedMoment: Date.now()
};

export const sparkChartGranularity = minutes.toMillis(30);

export function setDefaultMetrics(
  items: LogGroupItem[],
  setSelectedMetricGroup: React.Dispatch<any | undefined>,
  selectedMetricGroup?: string
) {
  if (items?.length === 0) {
    return;
  }

  if (selectedMetricGroup) {
    const metricExistsInItems = items.find(item => item.label === selectedMetricGroup);
    if (metricExistsInItems) {
      return;
    }
  }

  setSelectedMetricGroup(items[0].label);
}
