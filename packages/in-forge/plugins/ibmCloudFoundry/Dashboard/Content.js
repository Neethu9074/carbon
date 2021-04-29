/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import ContainerTable from 'in-forge/plugins/ibmCloudFoundry/Dashboard/ContainerTable';
import MemoryTable from 'in-forge/plugins/ibmCloudFoundry/Dashboard/MemoryTable';
import DiskTable from 'in-forge/plugins/ibmCloudFoundry/Dashboard/DiskTable';
import CpuTable from 'in-forge/plugins/ibmCloudFoundry/Dashboard/CpuTable';

export default function IbmCloudFoundryDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <CpuTable snapshot={snapshot} timeConfig={timeConfig} />
      <MemoryTable snapshot={snapshot} timeConfig={timeConfig} />
      <DiskTable snapshot={snapshot} timeConfig={timeConfig} />
      <ContainerTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
