/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import DeploymentManagersTable from 'in-forge/plugins/webSphereInfrastructureManager/Dashboard/DeploymentManagersTable';

export default function WebSphereInfrastructureManagerDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <DeploymentManagersTable snapshotId={snapshotId} timeConfig={timeConfig} />
    </div>
  );
}
