/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import MemoryTable from 'in-forge/plugins/iBMCloudEtcd/Dashboard/MemoryTable';
import DiskTable from 'in-forge/plugins/iBMCloudEtcd/Dashboard/DiskTable';

export default function iBMVSIDashboard({ snapshot, timeConfig }) {

  return (
    <div>
      <MemoryTable snapshot={snapshot} timeConfig={timeConfig} />
      <DiskTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
