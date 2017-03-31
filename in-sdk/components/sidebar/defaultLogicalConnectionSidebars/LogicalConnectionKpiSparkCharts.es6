import React from 'react';

import { percentageTwoDecimalPlaces, msTwoDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import SparkChartsSection from 'in-sdk/components/sidebar/SparkChartsSection';
import Separator from 'in-sdk/components/sidebar/Separator';

export default function LogicalConnectionSidebarKpiSparkCharts({ snapshot }) {
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
          }
        ]}
      />
    </div>
  );
}
