/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import RunningComponentsList from 'in-sdk/components/sidebar/RunningComponentsList';
import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';

import JbossDataGridClusters from '../JbossDataGridClusters.js';
import JbossDataGridCaches from '../JbossDataGridCaches.js';
import JbossDataGridPorts from '../JbossDataGridPorts.js';
import Info from '../Info.js';

export default function JbossDataGridSidebar({ snapshot }) {
  return (
    <div>
      <Info snapshot={snapshot} />
      <JbossDataGridPorts snapshot={snapshot} />
      <JbossDataGridCaches snapshot={snapshot} />
      <JbossDataGridClusters snapshot={snapshot} />
      <RunningComponentsList snapshotId={snapshot.get('id')} />
      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
