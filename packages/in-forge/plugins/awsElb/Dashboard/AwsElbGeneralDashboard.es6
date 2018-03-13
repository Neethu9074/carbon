import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { bytes } from 'in-services/formatters/number';
import Chart from 'in-components/Chart';

export default function AwsElbGeneralDashboard({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <DashboardSection title="Processed Bytes">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            min: 0,
            metrics: ['processed_bytes'],
            labels: ['Processed Bytes'],
            type: 'line',
            formatter: bytes.compact
          }}
        />
      </DashboardSection>
    </div>
  );
}
