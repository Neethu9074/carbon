/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import IntegrationServerTable from 'in-forge/plugins/aceIntegrationNode/Dashboard/IntegrationServerTable';

export default function AceIntegrationNodeDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <IntegrationServerTable snapshotId={snapshotId} timeConfig={timeConfig} />
    </div>
  );
}
