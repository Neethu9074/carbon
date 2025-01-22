/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { logLevelColors } from 'in-logging/analyze/AnalyzeView/components/Charts/constants';
import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import { getValueMatchTagFilter, LOG_LEVEL } from 'in-logging/queryBuilder';
import { Metric } from 'in-custom-dashboards/widgets/Chart/types';
import { ContextMenuButton } from 'in-components/Chart/types';
import { outlineForColor } from 'in-themes/chartColors';
import { TagFilterExpression } from 'in-types';
import { t } from 'in-i18n';

interface LogsChartProps {
  tagFilterExpression: TagFilterExpression;
  additionalContextMenuButtons: ContextMenuButton[];
}

interface AddLogLevelFilterTagToQueryModelRequest {
  tagFilterExpression: TagFilterExpression;
  value: string;
}

interface GetMetricConfigRequest extends AddLogLevelFilterTagToQueryModelRequest {
  label: string;
}

interface LogMetric extends Metric {
  tagFilterExpression: TagFilterExpression;
}

export default function LogsChart(props: LogsChartProps) {
  const { tagFilterExpression, additionalContextMenuButtons } = props;

  return (
    <UnifiedMetricsChart
      automaticallySize={false}
      renderLegend
      config={{
        additionalContextMenuButtons,
        y1: {
          outlineForColor,
          metrics: [
            getMetricConfig({
              tagFilterExpression,
              value: 'ERROR',
              label: t('in-logging:logsOverTime', { context: 'ERROR' })
            }),
            getMetricConfig({
              tagFilterExpression,
              value: 'WARN',
              label: t('in-logging:logsOverTime', { context: 'WARN' })
            }),
            getMetricConfig({
              tagFilterExpression,
              value: 'INFO',
              label: t('in-logging:logsOverTime', { context: 'INFO' })
            }),
            getMetricConfig({
              tagFilterExpression,
              value: 'FATAL',
              label: t('in-logging:logsOverTime', { context: 'FATAL' })
            }),
            getMetricConfig({
              tagFilterExpression,
              value: 'NONE',
              label: t('in-logging:logsOverTime', { context: 'NONE' })
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
        type: 'TIME_SERIES'
      }}
    />
  );
}

function getMetricConfig({ tagFilterExpression, value, label }: GetMetricConfigRequest): LogMetric {
  return {
    metric: 'logs_distribution',
    aggregation: 'SUM',
    label: label ?? value,
    source: 'LOG',
    tagFilterExpression: addLogLevelFilterTagToQueryModel({ value, tagFilterExpression })
    // granularity and timeConfig are send automatically by the chart impl
  };
}

function addLogLevelFilterTagToQueryModel({
  value,
  tagFilterExpression
}: AddLogLevelFilterTagToQueryModelRequest): TagFilterExpression {
  return {
    elements: [
      getValueMatchTagFilter({
        name: LOG_LEVEL,
        value
      }),
      tagFilterExpression
    ],
    logicalOperator: 'AND',
    type: 'EXPRESSION'
  };
}
