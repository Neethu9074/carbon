/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import TuplesTable from 'in-forge/plugins/ibmCloudPostgreSql/Dashboard/TuplesTable.js';
import MemoryTable from 'in-forge/plugins/ibmCloudPostgreSql/Dashboard/MemoryTable';
import DiskTable from 'in-forge/plugins/ibmCloudPostgreSql/Dashboard/DiskTable';
import CpuTable from 'in-forge/plugins/ibmCloudPostgreSql/Dashboard/CpuTable';

export default function ibmCloudPostgreSqlDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <CpuTable snapshot={snapshot} timeConfig={timeConfig} />
      <MemoryTable snapshot={snapshot} timeConfig={timeConfig} />
      <DiskTable snapshot={snapshot} timeConfig={timeConfig} />
      <TuplesTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
