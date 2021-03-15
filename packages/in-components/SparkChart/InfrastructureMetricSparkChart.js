/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import InfrastructureMetricChartBehavior from 'in-components/Chart/InfrastructureMetricChartBehavior';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import { getSparkChartGranularity } from 'in-applications/metrics';

export default function InfrastructureMetricSparkChart({
  snapshotId,
  timeConfig,
  tooltipFormatter,
  formatter,
  metric,
  renderPostChartContent
}) {
  return (
    <InfrastructureMetricChartBehavior
      snapshotId={snapshotId}
      timeConfig={timeConfig}
      minRollup={getSparkChartGranularity(timeConfig)}
      y1={{
        formatter,
        metrics: [metric],
        tooltipFormatter
      }}
      chartRenderer={SparkChartPropsAdapter}
      renderPostChartContent={renderPostChartContent}
    />
  );
}

function SparkChartPropsAdapter({ timeConfig, granularity, y1, renderPostChartContent }) {
  const metrics = y1.metrics[0];
  const metric = metrics && metrics.length > 0 ? metrics[metrics.length - 1][1] : null;

  return (
    <SparkChart
      rollup={granularity}
      timeConfig={timeConfig}
      metrics={metrics}
      tooltipFormatter={y1.tooltipFormatter || y1.formatter}
      metric={metric}
      renderPostChartContent={renderPostChartContent}
    />
  );
}
