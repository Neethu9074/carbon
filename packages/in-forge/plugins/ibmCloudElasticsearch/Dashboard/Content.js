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
import { getRawPayload } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      memberIds: getRawPayload(props.snapshot.get('id'), 'member_ids')
    };
  },
  function IbmElasticsearchDashboard({ snapshot, timeConfig, memberIds }) {
    return (
      <div>
        <StatusTable snapshot={snapshot} timeConfig={timeConfig} memberIds={memberIds} />
        <CpuTable snapshot={snapshot} timeConfig={timeConfig} memberIds={memberIds} />
        <JavaHeapTable snapshot={snapshot} timeConfig={timeConfig} memberIds={memberIds} />
        <MemoryTable snapshot={snapshot} timeConfig={timeConfig} memberIds={memberIds} />
        <DiskTable snapshot={snapshot} timeConfig={timeConfig} memberIds={memberIds} />
        <DiskIOTable snapshot={snapshot} timeConfig={timeConfig} memberIds={memberIds} />
      </div>
    );
  }
);
