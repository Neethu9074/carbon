import React, { Fragment } from 'react';

import HistogramsTable from 'in-sdk/components/dashboard/customMetrics/HistogramsTable';
import CountersTable from 'in-sdk/components/dashboard/customMetrics/CountersTable';
import GaugesTable from 'in-sdk/components/dashboard/customMetrics/GaugesTable';
import MetersTable from 'in-sdk/components/dashboard/customMetrics/MetersTable';
import TimersTable from 'in-sdk/components/dashboard/customMetrics/TimersTable';

export default function CustomMetrics({ snapshot, timeConfig, titlePrefix }) {
  return (
    <Fragment>
      <GaugesTable snapshot={snapshot} timeConfig={timeConfig} titlePrefix={titlePrefix} />
      <CountersTable snapshot={snapshot} timeConfig={timeConfig} titlePrefix={titlePrefix} />
      <MetersTable snapshot={snapshot} timeConfig={timeConfig} titlePrefix={titlePrefix} />
      <TimersTable snapshot={snapshot} timeConfig={timeConfig} titlePrefix={titlePrefix} />
      <HistogramsTable snapshot={snapshot} timeConfig={timeConfig} titlePrefix={titlePrefix} />
    </Fragment>
  );
}
