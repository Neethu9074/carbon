/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import MemoryTable from 'in-forge/plugins/ibmCloudHPPostgreSql/Dashboard/MemoryTable';
import DiskTable from 'in-forge/plugins/ibmCloudHPPostgreSql/Dashboard/DiskTable';
import CpuTable from 'in-forge/plugins/ibmCloudHPPostgreSql/Dashboard/CpuTable';
import { getRawPayload } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      nodeIds: getRawPayload(props.snapshot.get('id'), 'ids'),
      mounts: getRawPayload(props.snapshot.get('id'), 'mounts')
    };
  },
  function IbmHPPostgreSqlDashboard({ snapshot, timeConfig, nodeIds, mounts }) {
    return (
      <div>
        <CpuTable snapshot={snapshot} timeConfig={timeConfig} nodeIds={nodeIds} />
        <MemoryTable snapshot={snapshot} timeConfig={timeConfig} nodeIds={nodeIds} />
        <DiskTable snapshot={snapshot} timeConfig={timeConfig} nodeIds={nodeIds} mounts={mounts} />
      </div>
    );
  }
);
