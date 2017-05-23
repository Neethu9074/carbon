import React from 'react';

import Separator from 'in-sdk/components/sidebar/Separator';
import { percentageTwoDecimalPlaces, msTwoDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
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
            formatter: zeroDecimalPlaces
          },
          {
            metric: 'duration.mean',
            label: 'avg. latency',
            formatter: msTwoDecimalPlaces
          },
          {
            metric: 'error_rate',
            label: 'error rate',
            formatter: percentageTwoDecimalPlaces
          },
          {
            metric: 'instances',
            label: 'instance count',
            formatter: zeroDecimalPlaces
          }
        ]}
      />
    </div>
  );
}
