/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ConnectorsTable from 'in-forge/plugins/kafkaConnectCluster/Dashboard/ConnectorsTable.js';
import WorkersTable from 'in-forge/plugins/kafkaConnectCluster/Dashboard/WorkersTable.js';

export default function KafkaConnectClusterDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <WorkersTable clusterId={snapshotId} timeConfig={timeConfig} />
      <ConnectorsTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
