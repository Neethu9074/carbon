import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number, bytes } from 'in-services/formatters/number';
import Chart from 'in-components/Chart';

import AZAppTable from './AZAppTable';

export default function AwsElbAppDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <DashboardSection title="Processed Bytes">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['processed_bytes'],
            labels: ['Processed Bytes'],
            type: 'line',
            formatter: bytes.compact
          }}
        />
      </DashboardSection>

      <DashboardSection title="Connections">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['active_connection_count', 'new_connection_count', 'rejected_connection_count'],
            labels: ['Active', 'New', 'Rejected'],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>

      <DashboardSection title="ELB HTTP error codes">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['elb_4XX_count', 'elb_5XX_count'],
            labels: ['Status Code 4xx', 'Status Code 5xx'],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
      <AZAppTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
