import React from 'react';

import HttpServersTable from 'in-forge/plugins/genericNodejsApp/Dashboard/HttpServersTable';


export default function NodejsDashboard({snapshot, timeframe}) {
  return (
    <HttpServersTable snapshot={snapshot}
                      timeframe={timeframe} />
  );
}
