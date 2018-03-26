import React from 'react';

import ConnectorsTable from 'in-forge/plugins/jBossAsApplicationContainer/Dashboard/ConnectorsTable';
import DatasourcesTable from 'in-forge/plugins/jBossAsApplicationContainer/Dashboard/DatasourcesTable';
import EjbDeploymentsTable from 'in-forge/plugins/jBossAsApplicationContainer/Dashboard/EjbDeploymentsTable';
import WebDeploymentsTable from 'in-forge/plugins/jBossAsApplicationContainer/Dashboard/WebDeploymentsTable';
import UndertowStatsEnabledNotification from 'in-forge/plugins/jBossAsApplicationContainer/Dashboard/UndertowStatsEnabledNotification';

export default function JBossAsDashboard({ snapshot, timeframe }) {
  return (
    <div>
      <UndertowStatsEnabledNotification snapshot={snapshot} />
      <WebDeploymentsTable snapshot={snapshot} timeframe={timeframe} />
      <EjbDeploymentsTable snapshot={snapshot} timeframe={timeframe} />
      <ConnectorsTable snapshot={snapshot} timeframe={timeframe} />
      <DatasourcesTable snapshot={snapshot} timeframe={timeframe} />
    </div>
  );
}
