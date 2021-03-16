/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import AppliancesTable from 'in-forge/plugins/ibmDataPowerCluster/Dashboard/AppliancesTable';

export default function IbmDataPowerClusterDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <AppliancesTable snapshotId={snapshotId} timeConfig={timeConfig} />
    </div>
  );
}
