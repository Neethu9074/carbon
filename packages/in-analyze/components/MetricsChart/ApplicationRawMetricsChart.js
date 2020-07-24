import { withProps } from 'recompose';
import React from 'react';

import LatencyDistributionBase10Chart from 'in-new-components/LatencyDistributionBase10Chart/LatencyDistributionBase10Chart';
import getLatencyDistributionBase10 from 'in-subscription/application/getLatencyDistributionBase10';
import { latencySelection } from 'in-analyze/components/MetricsChart/metricsChartUtils';
import { getTagFilterListForBackendSubscription } from 'in-analyze/applicationFilter';
import RawMetricsChart from 'in-analyze/components/MetricsChart/RawMetricsChart';
import { latencyDistributionBase10Enabled } from 'in-services/featureFlags';
import { millis } from 'in-services/formatters/number';

const latencyDistributionChartDefinition = {
  label: 'Latency (distribution)',
  key: 'latency_DISTRIBUTION',
  formatter: millis.forcedCompactOnMs
};

export default withProps(({ filters }) => ({
  timeConfig: filters.timeConfig,
  chartDefinitions: latencyDistributionBase10Enabled ? [latencyDistributionChartDefinition] : [],
  customChartRenderers: [
    {
      key: 'calls_DISTRIBUTION',
      render: function LatencyDistribution() {
        const timeConfig = filters.timeConfig;
        const subscription = getLatencyDistributionBase10({
          maxLatencyBuckets: 80,
          filter: filters,
          tagFilters: getTagFilterListForBackendSubscription(filters.tagFilter),
          timeConfig,
          dataSource: filters.dataSource === 'traces' ? 'TRACES' : 'CALLS'
        });
        return (
          <LatencyDistributionBase10Chart
            subscription={subscription}
            selection={latencySelection(filters)}
            showPercentileMenu
            selectionAdjustable
            dataSource={filters.dataSource}
          />
        );
      }
    }
  ]
}))(RawMetricsChart);
