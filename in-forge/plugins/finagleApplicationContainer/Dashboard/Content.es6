import React from 'react';

import CountersTable from 'in-sdk/components/dashboard/customMetrics/CountersTable';
import GaugesTable from 'in-sdk/components/dashboard/customMetrics/GaugesTable';
import HistogramsTable from 'in-sdk/components/dashboard/customMetrics/HistogramsTable';

export default function FinagleDashboard({ snapshot, timeframe }) {
  return (
    <div>
      <GaugesTable snapshot={snapshot} timeframe={timeframe} />
      <CountersTable snapshot={snapshot} timeframe={timeframe} />      
      <HistogramsTable snapshot={snapshot} timeframe={timeframe} />
    </div>
  );
}
