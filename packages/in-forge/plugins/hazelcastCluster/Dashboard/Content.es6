import React from 'react';

import number from 'in-services/formatters/number';
import ClusterNodesTable from 'in-forge/plugins/hazelcastCluster/Dashboard/ClusterNodesTable';
import ClusterSummary from 'in-forge/plugins/hazelcastCluster/ClusterSummary';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart';

export default function HazelcastClusterDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <ClusterSummary snapshot={snapshot} />

      <DashboardSection title="Node Count">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: number,
            tooltipFormatter: number,
            metrics: ['nodeCount'],
            labels: ['Node Count'],
            type: 'line'
          }}
        />
      </DashboardSection>

      <ClusterNodesTable clusterSnapshotId={snapshot.get('id')} timeConfig={timeConfig} />
    </div>
  );
}
