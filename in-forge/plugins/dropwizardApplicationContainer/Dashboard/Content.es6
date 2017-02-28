import React from 'react';

import CountersTable from 'in-sdk/components/dashboard/customMetricsTmp/CountersTable';
import GaugesTable from 'in-sdk/components/dashboard/customMetricsTmp/GaugesTable';
import MetersTable from 'in-sdk/components/dashboard/customMetricsTmp/MetersTable';
import TimersTable from 'in-sdk/components/dashboard/customMetricsTmp/TimersTable';
import HistogramsTable from 'in-sdk/components/dashboard/customMetricsTmp/HistogramsTable';


export default function DropwizardDashboard({snapshot, timeframe}) {
  return (
    <div>
      <GaugesTable snapshot={snapshot} timeframe={timeframe} />
      <CountersTable snapshot={snapshot} timeframe={timeframe} />
      <MetersTable snapshot={snapshot} timeframe={timeframe} />
      <TimersTable snapshot={snapshot} timeframe={timeframe} />
      <HistogramsTable snapshot={snapshot} timeframe={timeframe} />
    </div>
  );
}
