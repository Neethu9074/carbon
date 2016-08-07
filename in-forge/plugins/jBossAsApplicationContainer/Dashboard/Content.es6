import React from 'react';

import DeploymentsTable from 'in-forge/plugins/jBossAsApplicationContainer/Dashboard/DeploymentsTable';
import ConnectorsTable from 'in-forge/plugins/jBossAsApplicationContainer/Dashboard/ConnectorsTable';


export default function JBossAsDashboard({snapshot, timeframe}) {
  return (
    <div>
      <DeploymentsTable snapshot={snapshot}
                        timeframe={timeframe} />

      <ConnectorsTable snapshot={snapshot}
                       timeframe={timeframe} />
    </div>
  );
}
