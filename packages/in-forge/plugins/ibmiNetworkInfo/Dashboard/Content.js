/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import NetstatInterfaceTable from 'in-forge/plugins/ibmiNetworkInfo/Dashboard/NetstatInterfaceTable';
import NetstatBytesOutTable from 'in-forge/plugins/ibmiNetworkInfo/Dashboard/NetstatBytesOutTable';
import NetstatBytesInTable from 'in-forge/plugins/ibmiNetworkInfo/Dashboard/NetstatBytesInTable';

export default function IbmINetworkInfoDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <NetstatInterfaceTable snapshotId={snapshotId} timeConfig={timeConfig} />
      <NetstatBytesInTable snapshotId={snapshotId} timeConfig={timeConfig} />
      <NetstatBytesOutTable snapshotId={snapshotId} timeConfig={timeConfig} />
    </div>
  );
}
