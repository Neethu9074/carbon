/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import TransactionsTable from 'in-forge/plugins/ibmCloudPostgreSql/Dashboard/TransactionsTable';
import ConnectionsTable from 'in-forge/plugins/ibmCloudPostgreSql/Dashboard/ConnectionsTable';
import DeadlocksTable from 'in-forge/plugins/ibmCloudPostgreSql/Dashboard/DeadlocksTable';
import BuffersTable from 'in-forge/plugins/ibmCloudPostgreSql/Dashboard/BuffersTable';
import TuplesTable from 'in-forge/plugins/ibmCloudPostgreSql/Dashboard/TuplesTable';
import MemoryTable from 'in-forge/plugins/ibmCloudPostgreSql/Dashboard/MemoryTable';
import BlocksTable from 'in-forge/plugins/ibmCloudPostgreSql/Dashboard/BlocksTable';
import FilesTable from 'in-forge/plugins/ibmCloudPostgreSql/Dashboard/FilesTable';
import CacheTable from 'in-forge/plugins/ibmCloudPostgreSql/Dashboard/CacheTable';
import DiskTable from 'in-forge/plugins/ibmCloudPostgreSql/Dashboard/DiskTable';
import CpuTable from 'in-forge/plugins/ibmCloudPostgreSql/Dashboard/CpuTable';

export default function ibmCloudPostgreSqlDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <CpuTable snapshot={snapshot} timeConfig={timeConfig} />
      <MemoryTable snapshot={snapshot} timeConfig={timeConfig} />
      <DiskTable snapshot={snapshot} timeConfig={timeConfig} />
      <ConnectionsTable snapshot={snapshot} timeConfig={timeConfig} />
      <TuplesTable snapshot={snapshot} timeConfig={timeConfig} />
      <TransactionsTable snapshot={snapshot} timeConfig={timeConfig} />
      <BlocksTable snapshot={snapshot} timeConfig={timeConfig} />
      <BuffersTable snapshot={snapshot} timeConfig={timeConfig} />
      <CacheTable snapshot={snapshot} timeConfig={timeConfig} />
      <FilesTable snapshot={snapshot} timeConfig={timeConfig} />
      <DeadlocksTable snapshot={snapshot} timeConfig={timeConfig} />
      <TuplesTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
