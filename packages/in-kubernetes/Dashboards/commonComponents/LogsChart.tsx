/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { Observable } from '@instana/observables';

import { logLevelColors } from 'in-logging/analyze/AnalyzeView/components/Charts/constants';
import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import { TagFilterExpression, TagFilterExpressionElementUnion } from 'in-types';
import { getValueMatchTagFilter, LOG_LEVEL } from 'in-logging/queryBuilder';
import { Metric } from 'in-custom-dashboards/widgets/Chart/types';
import { outlineForColor } from 'in-themes/chartColors';
import { ChartConfig } from 'in-components/Chart/types';
import { LogLevel } from 'in-logging/components/types';
import { t } from 'in-i18n';

interface AdditionalContextMenuButtonConfig {
  name: string;
  icon: string;
  label: string;
  getHref$: () => Observable<string>;
}

interface LogsChartProps {
  tagFilterExpression: TagFilterExpression | TagFilterExpressionElementUnion;
  additionalContextMenuButtons: AdditionalContextMenuButtonConfig[];
  onLegendItemToggle?: (chartConfig: ChartConfig, label: string) => void;
}

const logLevelsToShow: LogLevel[] = ['ERROR', 'INFO', 'WARN', 'FATAL', 'NONE'];

export default function LogsChart(props: LogsChartProps) {
  const { tagFilterExpression, additionalContextMenuButtons, onLegendItemToggle } = props;

  const metrics = logLevelsToShow.map(level => getLogMetric({ tagFilterExpression, level }));

  return (
    <UnifiedMetricsChart
      automaticallySize={false}
      renderLegend
      config={{
        additionalContextMenuButtons,
        y1: {
          outlineForColor,
          metrics,
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
      }}
      onLegendItemToggle={onLegendItemToggle}
    />
  );
}

interface GetLogMetricRequest {
  tagFilterExpression: TagFilterExpression | TagFilterExpressionElementUnion;
  level: string;
}

function getLogMetric(props: GetLogMetricRequest): Metric {
  const { tagFilterExpression, level } = props;
  return {
    metric: 'logs_distribution',
    aggregation: 'SUM',
    label: t('in-logging:logsOverTime', { context: level }),
    source: 'LOG',
    tagFilterExpression: addLogLevelFilterTagToQueryModel({ value: level, tagFilterExpression })
  };
}

interface AddLogLevelFilterTagToQueryModelRequest {
  tagFilterExpression: TagFilterExpressionElementUnion | TagFilterExpression;
  value: string;
}

export function addLogLevelFilterTagToQueryModel({
  value,
  tagFilterExpression
}: AddLogLevelFilterTagToQueryModelRequest) {
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
