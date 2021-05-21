/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import JavaHeapTable from 'in-forge/plugins/ibmCloudElasticsearch/Dashboard/JavaHeapTable';
import MemoryTable from 'in-forge/plugins/ibmCloudElasticsearch/Dashboard/MemoryTable';
import DiskIOTable from 'in-forge/plugins/ibmCloudElasticsearch/Dashboard/DiskIOTable';
import StatusTable from 'in-forge/plugins/ibmCloudElasticsearch/Dashboard/StatusTable';
import DiskTable from 'in-forge/plugins/ibmCloudElasticsearch/Dashboard/DiskTable';
import CpuTable from 'in-forge/plugins/ibmCloudElasticsearch/Dashboard/CpuTable';

export default function IbmElasticsearchDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <StatusTable snapshot={snapshot} timeConfig={timeConfig} />
      <CpuTable snapshot={snapshot} timeConfig={timeConfig} />
      <JavaHeapTable snapshot={snapshot} timeConfig={timeConfig} />
      <MemoryTable snapshot={snapshot} timeConfig={timeConfig} />
      <DiskTable snapshot={snapshot} timeConfig={timeConfig} />
      <DiskIOTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
