/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import MemoryTable from 'in-forge/plugins/ibmCloudRedis/Dashboard/MemoryTable';
import DiskTable from 'in-forge/plugins/ibmCloudRedis/Dashboard/DiskTable';
import CpuTable from 'in-forge/plugins/ibmCloudRedis/Dashboard/CpuTable';

export default function IbmRedisDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <CpuTable snapshot={snapshot} timeConfig={timeConfig} />
      <MemoryTable snapshot={snapshot} timeConfig={timeConfig} />
      <DiskTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
