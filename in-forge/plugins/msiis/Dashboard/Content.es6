import React from 'react';

import ApplicationPoolsTable from 'in-forge/plugins/msiis/Dashboard/ApplicationPoolsTable';
import WebsitesTable from 'in-forge/plugins/msiis/Dashboard/WebsitesTable';

export default function MsIISDashboard({ snapshot, timeframe }) {
  return (
    <div>
      <WebsitesTable snapshot={snapshot} timeframe={timeframe} />

      <ApplicationPoolsTable snapshot={snapshot} />
    </div>
  );
}
