import React from 'react';

import WorkersTable from 'in-forge/plugins/kafkaConnectCluster/Dashboard/WorkersTable.js';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number } from 'in-services/formatters/number';

export default function KafkaConnectClusterDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <DashboardSection title="Connectors">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            metrics: ['connectorCount'],
            labels: ['Connector Count'],
            type: 'line'
          }}
        />
      </DashboardSection>

      <WorkersTable clusterId={snapshotId} timeConfig={timeConfig} />
    </div>
  );
}
