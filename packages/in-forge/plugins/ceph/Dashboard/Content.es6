import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import PoolTable from 'in-forge/plugins/ceph/Dashboard/PoolTable';
import MonTable from 'in-forge/plugins/ceph/Dashboard/MonTable';
import { number } from 'in-services/formatters/number';
import Chart from 'in-components/Chart';

export default function CephDashboard({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <DashboardSection title="Ceph Cluster OSD Status">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            metrics: ['num_osds', 'num_up_osds', 'num_in_osds', 'num_down_osds'],
            labels: ['Total', 'Up', 'In', 'Unhealthy'],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>

      <DashboardSection title="Number Of Placement Groups">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            metrics: ['num_pgs'],
            labels: ['PGs Count'],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>

      <DashboardSection title="Number of Pools">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            metrics: ['num_pools'],
            labels: ['Pools Count'],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>

      <PoolTable snapshot={snapshot} timeframe={timeframe} />

      <MonTable snapshot={snapshot} timeframe={timeframe} />
    </div>
  );
}
