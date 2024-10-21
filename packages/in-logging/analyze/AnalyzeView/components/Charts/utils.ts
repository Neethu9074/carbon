/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { LogGroupItem, TagFilter, TagFilterExpression } from '@instana/types';

import { logLevelColors } from 'in-logging/analyze/AnalyzeView/components/Charts/constants';
import { getValueMatchTagFilter, LOG_LEVEL } from 'in-logging/queryBuilder';
import { NOT_EMPTY } from 'in-components/QueryBuilder/tagFilter/operators';
import { Config, Metric } from 'in-custom-dashboards/widgets/Chart/types';
import { ChartedMetric } from 'in-components/AnalyzeView/StateManagement';
import { capitalize } from 'in-services/formatters/string';
import { outlineForColor } from 'in-themes/chartColors';
import { Mutable } from 'in-types';
import { t } from 'in-i18n';

export const getLogsChartConfig = (
  backendQueryModelWithFacets: TagFilterExpression,
  metric: ChartedMetric,
  logGroups?: LogGroupItem[]
): Config => {
  const nextLogLevel = getNextLogLevelForChart(logGroups);

  const config: Config = {
    y1: {
      outlineForColor,
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
        }),
        getMetricConfig({
          backendQueryModelWithFacets,
          metric,
          tag: LOG_LEVEL,
          value: 'FATAL',
          label: t('in-logging:logsOverTime', { context: 'FATAL' })
        })
      ],
      colors: [
        logLevelColors.error,
        logLevelColors.warn,
        logLevelColors.info,
        logLevelColors.fatal,
        logLevelColors.nextloglevel
      ],
      formatter: 'number.compact',
      renderer: 'stackedBar'
    },
    y2: { metrics: [] },
    type: 'TIME_SERIES'
  };

  if (nextLogLevel && nextLogLevel.numberOfLogs > 0) {
    config.y1.metrics.push(
      getMetricConfig({
        backendQueryModelWithFacets,
        metric,
        tag: LOG_LEVEL,
        value: nextLogLevel.label,
        label: t('in-logging:logsOverTime', {
          context: 'NEXTLOGLEVEL',
          label: capitalize(nextLogLevel.label.toLowerCase())
        })
      })
    );
  }

  return config;
};

export const getNextLogLevelForChart = (logGroups?: LogGroupItem[]): LogGroupItem | null => {
  if (!logGroups) return null;

  const otherLogLevels = logGroups
    .filter(logGroup => !['ERROR', 'WARN', 'INFO', 'FATAL'].includes(logGroup.label))
    .sort(({ numberOfLogs: numberOfLogsA }, { numberOfLogs: numberOfLogsB }) => {
      if (numberOfLogsA === numberOfLogsB) return 0;
      return numberOfLogsA > numberOfLogsB ? -1 : 1;
    });

  return otherLogLevels[0] ?? null;
};

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
  key,
  type
}: GetMetricParams): Metric {
  const metricTagFilterExpression = getValueMatchTagFilter({ name: tag, key, value }) as Mutable<TagFilter>;

  if (type === 'KEY_VALUE_PAIR') {
    if (!key) {
      metricTagFilterExpression.operator = NOT_EMPTY;
      metricTagFilterExpression.key = value;
      delete metricTagFilterExpression.value;
    } else {
      metricTagFilterExpression.operator = 'EQUALS';
      metricTagFilterExpression.key = key;
      metricTagFilterExpression.value = value;
    }
  }

  return {
    metric: metric.metricId,
    aggregation: metric.aggregationId,
    label: label ?? (value || '-'),
    source: 'LOG',
    metricTagFilterExpression: metricTagFilterExpression,
    tagFilterExpression: backendQueryModelWithFacets

    // granularity and timeConfig are send automatically by the chart impl
  };
}
