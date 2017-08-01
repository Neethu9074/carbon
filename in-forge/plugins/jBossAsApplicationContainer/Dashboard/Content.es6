import React from 'react';

import DeploymentsTable from 'in-forge/plugins/jBossAsApplicationContainer/Dashboard/DeploymentsTable';
import ConnectorsTable from 'in-forge/plugins/jBossAsApplicationContainer/Dashboard/ConnectorsTable';
import DatasourcesTable from 'in-forge/plugins/jBossAsApplicationContainer/Dashboard/DatasourcesTable';
import UndertowStatsEnabledNotification from 'in-forge/plugins/jBossAsApplicationContainer/Dashboard/UndertowStatsEnabledNotification';

export default function JBossAsDashboard({ snapshot, timeframe }) {
  return (
    <div>
      <UndertowStatsEnabledNotification snapshot={snapshot} />
      <DeploymentsTable snapshot={snapshot} timeframe={timeframe} />
      <ConnectorsTable snapshot={snapshot} timeframe={timeframe} />
      <DatasourcesTable snapshot={snapshot} timeframe={timeframe} />
    </div>
  );
}
