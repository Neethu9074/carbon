import React from 'react';

import ClusterNodesTable from 'in-forge/plugins/consulCluster/Dashboard/ClusterNodesTable.es6';

export default function ConsulClusterDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <ClusterNodesTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
