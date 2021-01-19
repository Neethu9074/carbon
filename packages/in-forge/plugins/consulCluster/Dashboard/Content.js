/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ClusterNodesTable from 'in-forge/plugins/consulCluster/Dashboard/ClusterNodesTable.js';

export default function ConsulClusterDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <ClusterNodesTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
