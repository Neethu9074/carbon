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
import { getRawPayload } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      memberIds: getRawPayload(props.snapshot.get('id'), 'member_ids')
    };
  },
  function ibmCloudPostgreSqlDashboard({ snapshot, timeConfig, memberIds }) {
    return (
      <div>
        <CpuTable snapshot={snapshot} timeConfig={timeConfig} memberIds={memberIds} />
        <MemoryTable snapshot={snapshot} timeConfig={timeConfig} memberIds={memberIds} />
        <DiskTable snapshot={snapshot} timeConfig={timeConfig} memberIds={memberIds} />
        <ConnectionsTable snapshot={snapshot} timeConfig={timeConfig} memberIds={memberIds} />
        <TuplesTable snapshot={snapshot} timeConfig={timeConfig} memberIds={memberIds} />
        <TransactionsTable snapshot={snapshot} timeConfig={timeConfig} memberIds={memberIds} />
        <BlocksTable snapshot={snapshot} timeConfig={timeConfig} memberIds={memberIds} />
        <BuffersTable snapshot={snapshot} timeConfig={timeConfig} memberIds={memberIds} />
        <CacheTable snapshot={snapshot} timeConfig={timeConfig} memberIds={memberIds} />
        <FilesTable snapshot={snapshot} timeConfig={timeConfig} memberIds={memberIds} />
        <DeadlocksTable snapshot={snapshot} timeConfig={timeConfig} memberIds={memberIds} />
      </div>
    );
  }
);
