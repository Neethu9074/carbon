import React, { Fragment } from 'react';

import HistogramsTable from 'in-sdk/components/dashboard/customMetrics/HistogramsTable';
import CountersTable from 'in-sdk/components/dashboard/customMetrics/CountersTable';
import GaugesTable from 'in-sdk/components/dashboard/customMetrics/GaugesTable';
import MetersTable from 'in-sdk/components/dashboard/customMetrics/MetersTable';
import TimersTable from 'in-sdk/components/dashboard/customMetrics/TimersTable';

export default function CustomMetrics({ snapshot, timeConfig }) {
  return (
    <Fragment>
      <GaugesTable snapshot={snapshot} timeConfig={timeConfig} />
      <CountersTable snapshot={snapshot} timeConfig={timeConfig} />
      <MetersTable snapshot={snapshot} timeConfig={timeConfig} />
      <TimersTable snapshot={snapshot} timeConfig={timeConfig} />
      <HistogramsTable snapshot={snapshot} timeConfig={timeConfig} />
    </Fragment>
  );
}
