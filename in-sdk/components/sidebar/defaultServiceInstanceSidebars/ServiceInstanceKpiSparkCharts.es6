import React from 'react';

import { percentage, ms, number } from 'in-services/formatters/number';
import SparkChartsSection from 'in-sdk/components/sidebar/SparkChartsSection';

export default function ServiceInstanceKpiSparkCharts({ snapshot }) {
  return (
    <SparkChartsSection
      snapshot={snapshot}
      metrics={[
        {
          metric: 'count',
          label: 'calls/s',
          formatter: number
        },
        {
          metric: 'duration.mean',
          label: 'avg. latency',
          formatter: ms
        },
        {
          metric: 'error_rate',
          label: 'error rate',
          formatter: percentage
        }
      ]}
    />
  );
}
