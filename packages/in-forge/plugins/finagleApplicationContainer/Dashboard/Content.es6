import React from 'react';

import CountersTable from 'in-sdk/components/dashboard/customMetrics/CountersTable';
import GaugesTable from 'in-sdk/components/dashboard/customMetrics/GaugesTable';
import HistogramsTable from 'in-sdk/components/dashboard/customMetrics/HistogramsTable';

export default function FinagleDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <GaugesTable snapshot={snapshot} timeConfig={timeConfig} />
      <CountersTable snapshot={snapshot} timeConfig={timeConfig} />
      <HistogramsTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
