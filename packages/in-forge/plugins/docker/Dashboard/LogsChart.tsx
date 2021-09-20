/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { Observable } from '@instana/observables';

// @ts-expect-error
import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import { getValueMatchTagFilter, LOG_LEVEL } from 'in-logging/queryBuilder';
import { TagFilterExpression } from 'in-types';
import theme from 'in-themes';
import { t } from 'in-i18n';

interface AdditionalContextMenuButtonConfig {
  name: string;
  icon: string;
  label: string;
  getHref$: () => Observable<string>;
}

interface LogsChartProps {
  tagFilterExpression: TagFilterExpression;
  additionalContextMenuButtons: AdditionalContextMenuButtonConfig[];
}

interface AddLogLevelFilterTagToQueryModelRequest {
  tagFilterExpression: TagFilterExpression;
  value: string;
}

interface GetMetricConfigRequest extends AddLogLevelFilterTagToQueryModelRequest {
  label: string;
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
            })
          ],
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

function getMetricConfig({ tagFilterExpression, value, label }: GetMetricConfigRequest) {
  return {
    metric: 'logs_distribution',
    aggregation: 'SUM',
    label: label ?? value,
    source: 'DISTRIBUTED_LOGS_V2',
    tagFilterExpression: addLogLevelFilterTagToQueryModel({ value, tagFilterExpression })
    // granularity and timeConfig are send automatically by the chart impl
  };
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
