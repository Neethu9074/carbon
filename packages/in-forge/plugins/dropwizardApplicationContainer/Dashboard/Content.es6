import React from 'react';

import CountersTable from 'in-sdk/components/dashboard/customMetrics/CountersTable';
import GaugesTable from 'in-sdk/components/dashboard/customMetrics/GaugesTable';
import MetersTable from 'in-sdk/components/dashboard/customMetrics/MetersTable';
import TimersTable from 'in-sdk/components/dashboard/customMetrics/TimersTable';
import HistogramsTable from 'in-sdk/components/dashboard/customMetrics/HistogramsTable';

export default function DropwizardDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <GaugesTable snapshot={snapshot} timeConfig={timeConfig} />
      <CountersTable snapshot={snapshot} timeConfig={timeConfig} />
      <MetersTable snapshot={snapshot} timeConfig={timeConfig} />
      <TimersTable snapshot={snapshot} timeConfig={timeConfig} />
      <HistogramsTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
