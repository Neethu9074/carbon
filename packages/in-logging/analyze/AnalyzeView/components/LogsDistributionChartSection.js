/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ChartingConfiguratorSection from 'in-new-components/ChartingConfigurator/ChartingConfiguratorSection';
import emptyTagFilterExpression from 'in-new-components/QueryBuilder/tagFilter/emptyTagFilterExpression';
import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import theme from 'in-themes';
import { t } from 'in-i18n';

import locals from './LogsDistributionChartSection.mless';

const options = [
  {
    metricId: 'logs_distribution',
    label: t('in-logging:logs'),
    formatter: 'number.compact',
    aggregations: [
      {
        id: 'SUM',
        label: t('in-logging:sum'),
        renderers: [{ id: 'bar', label: t('in-logging:bar') }]
      }
    ]
  }
];

export default function LogsDistributionChartSection({
  chartedMetrics,
  onChartedMetricsChange,
  backendQueryModel,
  tracking
}) {
  const metric = chartedMetrics && chartedMetrics[0];

  return (
    <div className={locals.wrapper}>
      <ChartingConfiguratorSection
        value={chartedMetrics?.[0]}
        onChange={metric => onChartedMetricsChange(metric ? [metric] : [])}
        options={options}
        tracking={tracking}
        hideRenderer
      />

      {metric && (
        <div className={locals.chartWrapper}>
          <UnifiedMetricsChart
            automaticallySize={false}
            config={{
              y1: {
                metrics: [
                  getMetricConfig(
                    backendQueryModel,
                    metric,
                    'ERROR',
                    t('in-logging:logsOverTime', { context: 'ERROR' })
                  ),
                  getMetricConfig(backendQueryModel, metric, 'WARN', t('in-logging:logsOverTime', { context: 'WARN' })),
                  getMetricConfig(backendQueryModel, metric, 'INFO', t('in-logging:logsOverTime', { context: 'INFO' }))
                ],
                colors: [theme.lib.colors.failure, theme.lib.colors.warning, theme.lib.colors.lightBlue800],
                formatter: 'number.compact',
                renderer: 'stackedBar'
              },
              y2: { metrics: [] },
              type: 'TIME_SERIES'
            }}
          />
        </div>
      )}
    </div>
  );
}

function getMetricConfig(backendQueryModel, metric, logLevel, label) {
  return {
    metric: metric.metricId,
    aggregation: metric.aggregationId,
    label,
    source: 'DISTRIBUTED_LOGS_V2',
    logicalOperator: 'AND',
    logTagFilterExpression: addLogLevelFilterTagToQueryModel(logLevel, backendQueryModel),
    infraTagFilterExpression: emptyTagFilterExpression

    // granularity and timeConfig are send automatically by the chart impl
  };
}

function addLogLevelFilterTagToQueryModel(logLevel, backendQueryModel) {
  return {
    elements: [{ type: 'TAG_FILTER', name: 'log.level', value: logLevel, operator: 'EQUALS' }, backendQueryModel],
    logicalOperator: 'AND',
    type: 'EXPRESSION'
  };
}
