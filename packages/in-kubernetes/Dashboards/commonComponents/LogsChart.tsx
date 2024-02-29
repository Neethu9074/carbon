/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { Observable } from '@instana/observables';

import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import { TagFilterExpression, TagFilterExpressionElementUnion } from 'in-types';
import { getValueMatchTagFilter, LOG_LEVEL } from 'in-logging/queryBuilder';
import { carbonAlert, outlineForColor } from 'in-themes/chartColors';
import { Metric } from 'in-custom-dashboards/widgets/Chart/types';
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
          metrics: [errorMetric(tagFilterExpression), warnMetric(tagFilterExpression), infoMetric(tagFilterExpression)],
          colors: [carbonAlert.red60, carbonAlert.yellow30, carbonAlert.blue70],
          formatter: 'number.compact',
          renderer: 'stackedBar'
        },
        y2: { metrics: [] },
        type: 'TIME_SERIES'
      }}
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

const errorMetric = (tagFilterExpression: TagFilterExpressionElementUnion) =>
  getLogMetric({ tagFilterExpression, level: 'ERROR' });
const warnMetric = (tagFilterExpression: TagFilterExpressionElementUnion) =>
  getLogMetric({ tagFilterExpression, level: 'WARN' });
const infoMetric = (tagFilterExpression: TagFilterExpressionElementUnion) =>
  getLogMetric({ tagFilterExpression, level: 'INFO' });

interface AddLogLevelFilterTagToQueryModelRequest {
  tagFilterExpression: TagFilterExpressionElementUnion | TagFilterExpression;
  value: string;
}

function addLogLevelFilterTagToQueryModel({ value, tagFilterExpression }: AddLogLevelFilterTagToQueryModelRequest) {
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
