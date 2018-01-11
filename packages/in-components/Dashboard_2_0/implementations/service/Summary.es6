import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import { number } from 'in-services/formatters/number';
import TopList from 'in-components/TopList';
import Chart from 'in-components/Chart';

export default function Summary({ snapshot, timeframe }) {
  // dummy data
  snapshot = snapshot || {
    id: 'dummy-snapshot-id',
    get: () => 'dummy-snapshot-id'
  };

  const snapshotId = snapshot.get('id');

  const topListDummyTraces = ['6.2s', '5.0s', '4.7', '4.3s', '2.1s'];
  const topListDummyData = [
    {
      key: 'shop',
      label: 'shop',
      unit: 'ms',
      value: 812,
      maxValue: 812,
      traces: topListDummyTraces
    },
    {
      key: 'cart',
      label: 'cart',
      unit: 'ms',
      value: 756,
      maxValue: 812,
      traces: topListDummyTraces
    },
    {
      key: 'products',
      label: 'products',
      unit: 'ms',
      value: 682,
      maxValue: 812,
      traces: topListDummyTraces
    },
    {
      key: 'authentication',
      label: 'authentication',
      unit: 'ms',
      value: 413,
      maxValue: 812,
      traces: topListDummyTraces
    }
  ];

  return (
    <div>
      <Columize>
        <DashboardSection title="Some Chart">
          <Chart
            snapshotId={snapshotId}
            timeframe={timeframe}
            y1={{
              min: 0,
              metrics: ['dummy.whatever'],
              labels: ['Calls', 'Latency', 'Errors'],
              formatter: number.detailed,
              type: 'line'
            }}
          />
        </DashboardSection>
        <DashboardSection title="Technology Breakdown">
          <Chart
            snapshotId={snapshotId}
            timeframe={timeframe}
            y1={{
              min: 0,
              metrics: ['dummy.whatever'],
              labels: ['Calls', 'Latency', 'Errors'],
              formatter: number.detailed,
              type: 'line'
            }}
          />
        </DashboardSection>
      </Columize>
      <DashboardSection>
        <Columize>
          <TopList dummyData={topListDummyData} header="Traces" />
          <TopList dummyData={topListDummyData} header="Endpoints" />
        </Columize>
      </DashboardSection>
    </div>
  );
}
