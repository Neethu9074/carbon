import React from 'react';

import CountersTable from 'in-sdk/components/dashboard/customMetrics/CountersTable';
import GaugesTable from 'in-sdk/components/dashboard/customMetrics/GaugesTable';
import MetersTable from 'in-sdk/components/dashboard/customMetrics/MetersTable';
import TimersTable from 'in-sdk/components/dashboard/customMetrics/TimersTable';
import HistogramsTable from 'in-sdk/components/dashboard/customMetrics/HistogramsTable';

export default function DropwizardDashboard({ snapshot, timeframe }) {
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
