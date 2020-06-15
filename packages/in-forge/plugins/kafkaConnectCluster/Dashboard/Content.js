import React from 'react';

import WorkersTable from 'in-forge/plugins/kafkaConnectCluster/Dashboard/WorkersTable.js';
import ConnectorsTable from 'in-forge/plugins/kafkaConnectCluster/Dashboard/ConnectorsTable.js';

export default function KafkaConnectClusterDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <WorkersTable clusterId={snapshotId} timeConfig={timeConfig} />
      <ConnectorsTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
