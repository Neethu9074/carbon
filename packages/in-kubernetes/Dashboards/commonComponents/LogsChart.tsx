/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { Observable } from '@instana/observables';

// @ts-expect-error
import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import { getValueMatchTagFilter, LOG_LEVEL } from 'in-logging/queryBuilder';
import { TagFilterExpression, TagFilterExpressionElement } from 'in-types';
import theme from 'in-themes';
import { t } from 'in-i18n';

interface AdditionalContextMenuButtonConfig {
  name: string;
  icon: string;
  label: string;
  getHref$: () => Observable<string>;
}

interface LogsChartProps {
  tagFilterExpression: TagFilterExpression | TagFilterExpressionElement;
  additionalContextMenuButtons: AdditionalContextMenuButtonConfig[];
}

export default function LogsChart(props: LogsChartProps) {
  const { tagFilterExpression, additionalContextMenuButtons } = props;

  return (
    <UnifiedMetricsChart
      automaticallySize={false}
      renderLegend={false}
      config={{
        additionalContextMenuButtons,
        y1: {
          metrics: [errorMetric(tagFilterExpression), warnMetric(tagFilterExpression), infoMetric(tagFilterExpression)],
          colors: [theme.lib.colors.failure, theme.lib.colors.warning, theme.lib.colors.lightBlue800],
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
  tagFilterExpression: TagFilterExpression | TagFilterExpressionElement;
  level: string;
}

const getLogMetric = (props: GetLogMetricRequest) => {
  const { tagFilterExpression, level } = props;
  return {
    metric: 'logs_distribution',
    aggregation: 'SUM',
    label: t('in-logging:logsOverTime', { context: level }),
    source: 'LOG',
    tagFilterExpression: addLogLevelFilterTagToQueryModel({ value: level, tagFilterExpression })
  };
};

const errorMetric = (tagFilterExpression: TagFilterExpressionElement) =>
  getLogMetric({ tagFilterExpression, level: 'ERROR' });
const warnMetric = (tagFilterExpression: TagFilterExpressionElement) =>
  getLogMetric({ tagFilterExpression, level: 'WARN' });
const infoMetric = (tagFilterExpression: TagFilterExpressionElement) =>
  getLogMetric({ tagFilterExpression, level: 'INFO' });

interface AddLogLevelFilterTagToQueryModelRequest {
  tagFilterExpression: TagFilterExpressionElement | TagFilterExpression;
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
