/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import Catalog from 'in-forge/plugins/ibmApiConnect/Dashboard/Catalogs';

export default function IbmApiConnectDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <Catalog snapshotId={snapshotId} timeConfig={timeConfig} />
    </div>
  );
}
