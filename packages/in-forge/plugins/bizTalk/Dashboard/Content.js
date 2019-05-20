import React from 'react';

import { number, millis } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';

export default function BizTalkHostDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <DashboardSection title="Throttling & Delay">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['delay'],
            labels: ['Delivery Delay (MS)'],
            formatter: millis.compact,
            type: 'bar'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Locations & Threads">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['send_locs', 'rec_locs'],
            labels: ['Active Send Locations', 'Active Receive Locations'],
            formatter: number.compact,
            type: 'line'
          }}
          y2={{
            metrics: ['send_threads', 'rec_threads'],
            labels: ['Active Send Threads', ' Active Receive Threads'],
            formatter: number.compact,
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Documents">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['docs_proc', 'docs_resub', 'docs_rec', 'docs_sus'],
            labels: ['Processed', 'Resubmitted', 'Received', 'Suspended'],
            formatter: number.compact,
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}
