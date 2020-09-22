import { withProps } from 'recompose';
import React from 'react';

import LatencyDistributionBase10Chart from 'in-new-components/LatencyDistributionBase10Chart/LatencyDistributionBase10Chart';
import GroupMetricsChart, { metricsChartDefinitions } from 'in-analyze/components/MetricsChart/GroupMetricsChart';
import { getLatencySelectionFromFilters } from 'in-new-components/LatencyDistributionBase10Chart/latencyUtils';
import getLatencyDistributionBase10 from 'in-subscription/application/getLatencyDistributionBase10';
import { getTagFilterListForBackendSubscription } from 'in-analyze/applicationFilter';
import { number, millis } from 'in-services/formatters/number';
import Renderer from 'in-components/Chart/renderer/Renderer';

const latencyDistributionChartDefinition = {
  label: 'Latency (distribution)',
  key: 'latency_DISTRIBUTION',
  formatter: millis.forcedCompactOnMs
};

export default withProps(({ filters, metrics, availableMetrics, onFocusedMetricChange, onLatencySelectionChanged }) => {
  const dataSource = filters.dataSource;
  const latencyTag = dataSource === 'traces' ? 'trace.latency' : 'call.latency';
  const countChartDefinitions = [
    {
      label: 'Count',
      key: dataSource === 'traces' ? 'traces_SUM' : 'calls_SUM',
      renderer: Renderer.stackedBar,
      aggregation: 'SUM',
      formatter: number.forcedCompact,
      min: 0
    }
  ];
  return {
    timeConfig: filters.timeConfig,
    chartDefinitions: [latencyDistributionChartDefinition]
      .concat(countChartDefinitions)
      .concat(metricsChartDefinitions(metrics, availableMetrics)),
    onChange: e => onFocusedMetricChange(e.focusedMetric),
    customChartRenderers: [
      {
        key: 'latency_DISTRIBUTION',
        render: function LatencyDistribution() {
          const timeConfig = filters.timeConfig;
          const subscription = getLatencyDistributionBase10({
            maxLatencyBuckets: 80,
            filter: {
              // auto refresh mode is not supported in UA
              timeConfig: { ...timeConfig, autoRefresh: false }
            },
            tagFilters: getTagFilterListForBackendSubscription(filters.tagFilter.filter(f => f.name !== latencyTag)),
            dataSource: dataSource === 'traces' ? 'TRACES' : 'CALLS'
          });
          return (
            <LatencyDistributionBase10Chart
              subscription={subscription}
              selection={getLatencySelectionFromFilters(filters.dataSource, filters.tagFilter)}
              showPercentileMenu
              selectionAdjustable
              onSelectionChanged={onLatencySelectionChanged}
              dataSource={dataSource}
            />
          );
        }
      }
    ]
  };
})(GroupMetricsChart);
