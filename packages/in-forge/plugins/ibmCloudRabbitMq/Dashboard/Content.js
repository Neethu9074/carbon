/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import MemoryTable from 'in-forge/plugins/ibmCloudRabbitMq/Dashboard/MemoryTable';
import DiskIOTable from 'in-forge/plugins/ibmCloudRabbitMq/Dashboard/DiskIOTable';
import DiskTable from 'in-forge/plugins/ibmCloudRabbitMq/Dashboard/DiskTable';

export default function IbmRabbitMqDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <MemoryTable snapshot={snapshot} timeConfig={timeConfig} />
      <DiskTable snapshot={snapshot} timeConfig={timeConfig} />
      <DiskIOTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
