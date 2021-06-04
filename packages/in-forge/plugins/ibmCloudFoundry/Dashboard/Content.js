/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import ContainerTable from 'in-forge/plugins/ibmCloudFoundry/Dashboard/ContainerTable';
import MemoryTable from 'in-forge/plugins/ibmCloudFoundry/Dashboard/MemoryTable';
import DiskTable from 'in-forge/plugins/ibmCloudFoundry/Dashboard/DiskTable';
import CpuTable from 'in-forge/plugins/ibmCloudFoundry/Dashboard/CpuTable';
import { getRawPayload } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      instanceCount: getRawPayload(props.snapshot.get('id'), 'instanceCount')
    };
  },
  function IbmCloudFoundryDashboard({ snapshot, timeConfig, instanceCount }) {
    return (
      <div>
        <CpuTable snapshot={snapshot} timeConfig={timeConfig} instanceCount={instanceCount} />
        <MemoryTable snapshot={snapshot} timeConfig={timeConfig} instanceCount={instanceCount} />
        <DiskTable snapshot={snapshot} timeConfig={timeConfig} instanceCount={instanceCount} />
        <ContainerTable snapshot={snapshot} timeConfig={timeConfig} instanceCount={instanceCount} />
      </div>
    );
  }
);
