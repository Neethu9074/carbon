import React from 'react';

import FrontendsTable from 'in-forge/plugins/hAProxy/Dashboard/FrontendsTable';
import BackendsTable from 'in-forge/plugins/hAProxy/Dashboard/BackendsTable';
import DashboardNotification from 'in-components/DashboardNotification';

export default function HAProxyDashboard({ snapshot, timeframe }) {
  const socketPath = snapshot.getIn(['data', 'socketPath']);
  if (!socketPath) {
    return (
      <DashboardNotification type="info">
        HAProxy is not configured for socket access.
        Please configure <code>stats socket</code> to point to a UNIX socket.
      </DashboardNotification>
    );
  }

  return (
    <div>
      <FrontendsTable snapshot={snapshot} timeframe={timeframe} />
      <BackendsTable snapshot={snapshot} timeframe={timeframe} />
    </div>
  );
}
