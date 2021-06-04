/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import MemoryTable from 'in-forge/plugins/ibmCloudRabbitMq/Dashboard/MemoryTable';
import DiskIOTable from 'in-forge/plugins/ibmCloudRabbitMq/Dashboard/DiskIOTable';
import DiskTable from 'in-forge/plugins/ibmCloudRabbitMq/Dashboard/DiskTable';
import { getRawPayload } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      memberIds: getRawPayload(props.snapshot.get('id'), 'member_ids')
    };
  },
  function IbmRabbitMqDashboard({ snapshot, timeConfig, memberIds }) {
    return (
      <div>
        <MemoryTable snapshot={snapshot} timeConfig={timeConfig} memberIds={memberIds} />
        <DiskTable snapshot={snapshot} timeConfig={timeConfig} memberIds={memberIds} />
        <DiskIOTable snapshot={snapshot} timeConfig={timeConfig} memberIds={memberIds} />
      </div>
    );
  }
);
