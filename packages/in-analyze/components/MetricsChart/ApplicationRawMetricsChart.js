/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import LatencyDistributionBase10Chart from 'in-new-components/LatencyDistributionBase10Chart/LatencyDistributionBase10Chart';
import getLatencyDistributionBase10 from 'in-subscription/application/getLatencyDistributionBase10';
import { getLatencySelectionFromFilters } from 'in-applications/analyze/utils/latencyUtils';
import { getTagFilterListForBackendSubscription } from 'in-analyze/applicationFilter';
import RawMetricsChart from 'in-analyze/components/MetricsChart/RawMetricsChart';
import { millis } from 'in-services/formatters/number';
import { t } from 'in-i18n';

const latencyDistributionChartDefinition = {
  label: t('in-analyze:components.metricsChart.latencyDistribution'),
  key: 'latency_DISTRIBUTION',
  formatter: millis.forcedCompactOnMs
};

export default function ApplicationRawMetricChart(props) {
  const { filters, onLatencySelectionChanged } = props;

  const latencyTag = filters.dataSource === 'traces' ? 'trace.latency' : 'call.latency';
  const timeConfig = filters.timeConfig;
  const chartDefinitions = [latencyDistributionChartDefinition];
  const customChartRenderers = [
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
  ];

  return (
    <RawMetricsChart
      {...props}
      timeConfig={timeConfig}
      chartDefinitions={chartDefinitions}
      customChartRenderers={customChartRenderers}
    />
  );
}
