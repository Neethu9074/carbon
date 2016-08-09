import React from 'react';

import DataSourcesTable from 'in-forge/plugins/tomcatApplicationContainer/Dashboard/DataSourcesTable';
import ConnectorsTable from 'in-forge/plugins/tomcatApplicationContainer/Dashboard/ConnectorsTable';
import ExecutorsTable from 'in-forge/plugins/tomcatApplicationContainer/Dashboard/ExecutorsTable';
import WebAppsTable from 'in-forge/plugins/tomcatApplicationContainer/Dashboard/WebAppsTable';


export default function TomcatDashboard({snapshot, timeframe}) {
  return (
    <div>
      <WebAppsTable snapshot={snapshot}
                    timeframe={timeframe} />
      <ConnectorsTable snapshot={snapshot}
                       timeframe={timeframe} />
      <ExecutorsTable snapshot={snapshot}
                      timeframe={timeframe} />
      <DataSourcesTable snapshot={snapshot}
                        timeframe={timeframe} />
    </div>
  );
}
