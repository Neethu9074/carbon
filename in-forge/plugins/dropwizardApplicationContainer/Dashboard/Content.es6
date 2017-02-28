import React from 'react';

import CountersTable from 'in-forge/plugins/dropwizardApplicationContainer/Dashboard/CountersTable';
import GaugesTable from 'in-forge/plugins/dropwizardApplicationContainer/Dashboard/GaugesTable';
import MetersTable from 'in-forge/plugins/dropwizardApplicationContainer/Dashboard/MetersTable';
import TimersTable from 'in-forge/plugins/dropwizardApplicationContainer/Dashboard/TimersTable';
import HistogramsTable from 'in-forge/plugins/dropwizardApplicationContainer/Dashboard/HistogramsTable';


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
