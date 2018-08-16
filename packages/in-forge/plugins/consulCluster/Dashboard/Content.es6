import React from 'react';

import CriticalServicesTable from 'in-forge/plugins/consulCluster/Dashboard/CriticalServicesTable.es6';
import ClusterNodesTable from 'in-forge/plugins/consulCluster/Dashboard/ClusterNodesTable.es6';

export default function ConsulClusterDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <ClusterNodesTable snapshot={snapshot} timeConfig={timeConfig} />

      <CriticalServicesTable snapshot={snapshot} />
    </div>
  );
}
