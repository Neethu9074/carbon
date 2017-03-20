import React from 'react';

import ApplicationsTable from 'in-forge/plugins/cloudFoundry/Dashboard/ApplicationsTable';
import DiegoTable from 'in-forge/plugins/cloudFoundry/Dashboard/DiegoTable';
import DopplerTable from 'in-forge/plugins/cloudFoundry/Dashboard/DopplerTable';
import DEATable from 'in-forge/plugins/cloudFoundry/Dashboard/DEATable';
import CloudControllerTable from 'in-forge/plugins/cloudFoundry/Dashboard/CloudControllerTable';
import HealthManagerTable from 'in-forge/plugins/cloudFoundry/Dashboard/HealthManagerTable';

export default function CloudFoundryDashboard({snapshot, timeframe}) {
  return (
    <div>
      <ApplicationsTable snapshot={snapshot}
                         timeframe={timeframe} />

      <DiegoTable snapshot={snapshot}
                  timeframe={timeframe} />

      <DopplerTable snapshot={snapshot}
                    timeframe={timeframe} />

      <DEATable snapshot={snapshot}
                timeframe={timeframe} />

      <CloudControllerTable snapshot={snapshot}
                            timeframe={timeframe} />

      <HealthManagerTable snapshot={snapshot}
                          timeframe={timeframe} />

    </div>
  );
}
