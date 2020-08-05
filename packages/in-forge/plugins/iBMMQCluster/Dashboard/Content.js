import React from 'react';

import QueueManagersTable from 'in-forge/plugins/iBMMQCluster/Dashboard/QueueManagersTable';
import ListenersTable from 'in-forge/plugins/iBMMQCluster/Dashboard/ListenersTable';
import TopicsTable from 'in-forge/plugins/iBMMQCluster/Dashboard/TopicsTable';

export default function IBMMQClusterDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <QueueManagersTable snapshot={snapshot} timeConfig={timeConfig} />
      <TopicsTable snapshot={snapshot} timeConfig={timeConfig} />
      <ListenersTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
