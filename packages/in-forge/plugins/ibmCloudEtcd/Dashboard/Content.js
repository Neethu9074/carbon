/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import MemoryTable from 'in-forge/plugins/ibmCloudEtcd/Dashboard/MemoryTable';
import DiskIOTable from 'in-forge/plugins/ibmCloudEtcd/Dashboard/DiskIOTable';
import DiskTable from 'in-forge/plugins/ibmCloudEtcd/Dashboard/DiskTable';

export default function IbmEtcdDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <MemoryTable snapshot={snapshot} timeConfig={timeConfig} />
      <DiskTable snapshot={snapshot} timeConfig={timeConfig} />
      <DiskIOTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
