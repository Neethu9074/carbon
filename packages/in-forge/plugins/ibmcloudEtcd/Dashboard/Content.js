/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import MemoryTable from 'in-forge/plugins/ibmcloudEtcd/Dashboard/MemoryTable';
import DiskTable from 'in-forge/plugins/ibmcloudEtcd/Dashboard/DiskTable';

export default function ibmcloudVSIDashboard({ snapshot, timeConfig }) {

  return (
    <div>
      <MemoryTable snapshot={snapshot} timeConfig={timeConfig} />
      <DiskTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
