/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { TagFilterExpression } from '@instana/types';

import { getValueMatchTagFilter, LOG_LEVEL } from 'in-logging/queryBuilder';
import { Config, Metric } from 'in-custom-dashboards/widgets/Chart/types';
import { ChartedMetric } from 'in-components/AnalyzeView/StateManagement';
import theme from 'in-themes';
import { t } from 'in-i18n';

export const getLogsChartConfig = (
  backendQueryModelWithFacets: TagFilterExpression,
  metric: ChartedMetric
): Config => ({
  y1: {
    metrics: [
      getMetricConfig({
        backendQueryModelWithFacets,
        metric,
        tag: LOG_LEVEL,
        value: 'ERROR',
        label: t('in-logging:logsOverTime', { context: 'ERROR' })
      }),
      getMetricConfig({
        backendQueryModelWithFacets,
        metric,
        tag: LOG_LEVEL,
        value: 'WARN',
        label: t('in-logging:logsOverTime', { context: 'WARN' })
      }),
      getMetricConfig({
        backendQueryModelWithFacets,
        metric,
        tag: LOG_LEVEL,
        value: 'INFO',
        label: t('in-logging:logsOverTime', { context: 'INFO' })
      })
    ],
    colors: [theme.lib.colors.failure, theme.lib.colors.warning, theme.lib.colors.lightBlue800],
    formatter: 'number.compact',
    renderer: 'stackedBar'
  },
  y2: { metrics: [] },
  type: 'TIME_SERIES'
});

interface GetMetricParams {
  backendQueryModelWithFacets: TagFilterExpression;
  metric: ChartedMetric;
  tag: string;
  value: string;
  label?: string;
  key?: string;
  type?: string;
}
export function getMetricConfig({
  backendQueryModelWithFacets,
  metric,
  tag,
  value,
  label,
  key
}: GetMetricParams): Metric {
  return {
    metric: metric.metricId,
    aggregation: metric.aggregationId,
    label: label ?? value,
    source: 'LOG',
    metricTagFilterExpression: getValueMatchTagFilter({ name: tag, key, value }),
    tagFilterExpression: backendQueryModelWithFacets

    // granularity and timeConfig are send automatically by the chart impl
  };
}
