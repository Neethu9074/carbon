import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { bytes } from 'in-services/formatters/number';
import Chart from 'in-components/Chart';

export default function AwsEcMemcachedDashboard({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <DashboardSection title="Hashing">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            min: 0,
            metrics: ['bytes_used_for_hash'],
            labels: ['Bytes Used For Hash'],
            type: 'line',
            formatter: bytes.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title="Commands">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80,
            right: 40
          }}
          y1={{
            min: 0,
            metrics: ['cmd_config_get', 'cmd_config_set', 'cmd_touch'],
            labels: ['Config Get', 'Config Set', 'Touch'],
            type: 'line',
            formatter: bytes.compact
          }}
        />
      </DashboardSection>
    </div>
  );
}
