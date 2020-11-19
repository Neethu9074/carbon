import { withProps } from 'recompose';
import React from 'react';

import LatencyDistributionBase10Chart from 'in-new-components/LatencyDistributionBase10Chart/LatencyDistributionBase10Chart';
import getLatencyDistributionBase10 from 'in-subscription/application/getLatencyDistributionBase10';
import { getLatencySelectionFromFilters } from 'in-applications/analyze/utils/latencyUtils';
import { getTagFilterListForBackendSubscription } from 'in-analyze/applicationFilter';
import RawMetricsChart from 'in-analyze/components/MetricsChart/RawMetricsChart';
import { millis } from 'in-services/formatters/number';

const latencyDistributionChartDefinition = {
  label: 'Latency (distribution)',
  key: 'latency_DISTRIBUTION',
  formatter: millis.forcedCompactOnMs
};

export default withProps(({ filters, onLatencySelectionChanged }) => {
  const latencyTag = filters.dataSource === 'traces' ? 'trace.latency' : 'call.latency';
  return {
    timeConfig: filters.timeConfig,
    chartDefinitions: [latencyDistributionChartDefinition],
    customChartRenderers: [
      {
        key: 'latency_DISTRIBUTION',
        render: function LatencyDistribution() {
          const timeConfig = filters.timeConfig;
          const subscription = getLatencyDistributionBase10({
            maxLatencyBuckets: 80,
            includePercentiles: true,
            filter: {
              // auto refresh mode is not supported in UA
              timeConfig: { ...timeConfig, autoRefresh: false }
            },
            tagFilters: getTagFilterListForBackendSubscription(filters.tagFilter.filter(f => f.name !== latencyTag)),
            dataSource: filters.dataSource === 'traces' ? 'TRACES' : 'CALLS'
          });
          return (
            <LatencyDistributionBase10Chart
              subscription={subscription}
              selection={getLatencySelectionFromFilters(filters.dataSource, filters.tagFilter)}
              showPercentileMenu
              selectionAdjustable
              dataSource={filters.dataSource}
              onSelectionChanged={onLatencySelectionChanged}
            />
          );
        }
      }
    ]
  };
})(RawMetricsChart);
