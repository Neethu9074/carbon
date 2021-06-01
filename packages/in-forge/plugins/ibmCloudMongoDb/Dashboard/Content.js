/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import ConnectionsTable from 'in-forge/plugins/ibmCloudMongoDb/Dashboard/ConnectionsTable';
import ReplicaTable from 'in-forge/plugins/ibmCloudMongoDb/Dashboard/ReplicaTable';
import MemoryTable from 'in-forge/plugins/ibmCloudMongoDb/Dashboard/MemoryTable';
import LocksTable from 'in-forge/plugins/ibmCloudMongoDb/Dashboard/LocksTable';
import OplogTable from 'in-forge/plugins/ibmCloudMongoDb/Dashboard/OplogTable';
import DiskTable from 'in-forge/plugins/ibmCloudMongoDb/Dashboard/DiskTable';
import CpuTable from 'in-forge/plugins/ibmCloudMongoDb/Dashboard/CpuTable';
import { getRawPayload } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      memberIds: getRawPayload(props.snapshot.get('id'), 'member_ids')
    };
  },
  function IbmEtcdDashboard({ snapshot, timeConfig, memberIds }) {
    return (
      <div>
        <CpuTable snapshot={snapshot} timeConfig={timeConfig} memberIds={memberIds} />
        <MemoryTable snapshot={snapshot} timeConfig={timeConfig} memberIds={memberIds} />
        <DiskTable snapshot={snapshot} timeConfig={timeConfig} memberIds={memberIds} />
        <ConnectionsTable snapshot={snapshot} timeConfig={timeConfig} memberIds={memberIds} />
        <LocksTable snapshot={snapshot} timeConfig={timeConfig} memberIds={memberIds} />
        <OplogTable snapshot={snapshot} timeConfig={timeConfig} memberIds={memberIds} />
        <ReplicaTable snapshot={snapshot} timeConfig={timeConfig} memberIds={memberIds} />
      </div>
    );
  }
);
