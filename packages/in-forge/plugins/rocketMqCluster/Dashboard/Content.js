/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import BrokersTable from 'in-forge/plugins/rocketMqCluster/Dashboard/BrokersTable';
import TopicsTable from 'in-forge/plugins/rocketMqCluster/Dashboard/TopicsTable';

export default function RocketMqClusterDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <BrokersTable snapshotId={snapshotId} timeConfig={timeConfig} />
      <TopicsTable snapshotId={snapshotId} timeConfig={timeConfig} />
    </div>
  );
}
