/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ChartingConfiguratorSection from 'in-new-components/ChartingConfigurator/ChartingConfiguratorSection';
import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';

import locals from './LogsDistributionChartSection.mless';

const options = [
  {
    metricId: 'logs_distribution',
    label: 'Logs',
    formatter: 'number.compact',
    aggregations: [
      {
        id: 'SUM',
        label: 'sum',
        renderers: [{ id: 'bar', label: 'Bar' }]
      }
    ]
  }
];

export default function LogsDistributionChartSection({ metrics, onMetricsChange, backendQueryModel }) {
  const metric = metrics && metrics[0];

  return (
    <div className={locals.wrapper}>
      <ChartingConfiguratorSection
        value={
          metrics.map(metricState => ({
            metricId: metricState.metric,
            aggregationId: metricState.aggregation
          }))[0]
        }
        onChange={m => onMetricChange(m, onMetricsChange)}
        options={options}
        hideRenderer
      />

      {metric && (
        <div className={locals.chartWrapper}>
          <UnifiedMetricsChart
            automaticallySize={false}
            config={{
              y1: {
                metrics: [
                  {
                    ...metric,
                    label: 'Logs over time',
                    source: 'DISTRIBUTED_LOGS',
                    tagFilterExpression: backendQueryModel
                  }
                ],
                formatter: 'number.compact',
                renderer: 'bar'
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

function onMetricChange(metric, onMetricsChange) {
  onMetricsChange(
    metric
      ? [
          {
            metric: metric.metricId,
            aggregation: metric.aggregationId
          }
        ]
      : []
  );
}
