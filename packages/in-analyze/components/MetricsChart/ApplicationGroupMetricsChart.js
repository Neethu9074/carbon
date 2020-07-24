import { withProps } from 'recompose';
import React from 'react';

import LatencyDistributionBase10Chart from 'in-new-components/LatencyDistributionBase10Chart/LatencyDistributionBase10Chart';
import GroupMetricsChart, { metricsChartDefinitions } from 'in-analyze/components/MetricsChart/GroupMetricsChart';
import getLatencyDistributionBase10 from 'in-subscription/application/getLatencyDistributionBase10';
import { latencySelection } from 'in-analyze/components/MetricsChart/metricsChartUtils';
import { getTagFilterListForBackendSubscription } from 'in-analyze/applicationFilter';
import { latencyDistributionBase10Enabled } from 'in-services/featureFlags';
import { number, millis } from 'in-services/formatters/number';
import Renderer from 'in-components/Chart/renderer/Renderer';

const countChartDefinitions = [
  {
    label: 'Count',
    key: 'calls_SUM',
    renderer: Renderer.stackedBar,
    aggregation: 'SUM',
    formatter: number.forcedCompact,
    min: 0
  },
  {
    label: 'Count',
    key: 'traces_SUM',
    renderer: Renderer.stackedBar,
    aggregation: 'SUM',
    formatter: number.forcedCompact,
    min: 0
  }
];

const latencyDistributionChartDefinition = {
  label: 'Latency (distribution)',
  key: 'latency_DISTRIBUTION',
  formatter: millis.forcedCompactOnMs
};

const latencyChartDefinitions = latencyDistributionBase10Enabled ? [latencyDistributionChartDefinition] : [];

export default withProps(({ filters, metrics, availableMetrics, onFocusedMetricChange }) => ({
  timeConfig: filters.timeConfig,
  chartDefinitions: latencyChartDefinitions
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
          />
        );
      }
    }
  ]
}))(GroupMetricsChart);
