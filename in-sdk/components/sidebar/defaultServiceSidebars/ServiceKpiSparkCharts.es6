import React from 'react';

import Separator from 'in-sdk/components/sidebar/Separator';
import { percentage, ms, number } from 'in-services/formatters/number';
import SparkChartsSection from 'in-sdk/components/sidebar/SparkChartsSection';

export default function ServiceKpiSparkCharts({ snapshot }) {
  return (
    <div>
      <Separator />

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
          },
          {
            metric: 'instances',
            label: 'instances',
            formatter: number
          }
        ]}
      />
    </div>
  );
}
