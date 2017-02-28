import React from 'react';

import CountersTable from 'in-sdk/components/dashboard/CustomMetrics/CountersTable';
import GaugesTable from 'in-sdk/components/dashboard/CustomMetrics/GaugesTable';
import MetersTable from 'in-sdk/components/dashboard/CustomMetrics/MetersTable';
import TimersTable from 'in-sdk/components/dashboard/CustomMetrics/TimersTable';
import HistogramsTable from 'in-sdk/components/dashboard/CustomMetrics/HistogramsTable';


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
