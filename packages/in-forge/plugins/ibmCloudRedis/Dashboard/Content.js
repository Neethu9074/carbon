/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import MemoryTable from 'in-forge/plugins/ibmCloudRedis/Dashboard/MemoryTable';
import DiskIOTable from 'in-forge/plugins/ibmCloudRedis/Dashboard/DiskIOTable';
import DiskTable from 'in-forge/plugins/ibmCloudRedis/Dashboard/DiskTable';
import CpuTable from 'in-forge/plugins/ibmCloudRedis/Dashboard/CpuTable';
import { getRawPayload } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      memberIds: getRawPayload(props.snapshot.get('id'), 'member_ids')
    };
  },
  function IbmRedisDashboard({ snapshot, timeConfig, memberIds }) {
    return (
      <div>
        <CpuTable snapshot={snapshot} timeConfig={timeConfig} memberIds={memberIds} />
        <MemoryTable snapshot={snapshot} timeConfig={timeConfig} memberIds={memberIds} />
        <DiskTable snapshot={snapshot} timeConfig={timeConfig} memberIds={memberIds} />
        <DiskIOTable snapshot={snapshot} timeConfig={timeConfig} memberIds={memberIds} />
      </div>
    );
  }
);
