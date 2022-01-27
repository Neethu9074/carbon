/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ClusterTable from 'in-forge/plugins/webSphereCluster/Dashboard/MemberTable';

export default function WebSphereClusterDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <ClusterTable snapshotId={snapshotId} timeConfig={timeConfig} />
    </div>
  );
}
