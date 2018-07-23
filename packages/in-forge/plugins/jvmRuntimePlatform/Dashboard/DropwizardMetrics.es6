import React from 'react';

import CountersTable from 'in-sdk/components/dashboard/customMetrics/CountersTable';
import GaugesTable from 'in-sdk/components/dashboard/customMetrics/GaugesTable';
import MetersTable from 'in-sdk/components/dashboard/customMetrics/MetersTable';
import TimersTable from 'in-sdk/components/dashboard/customMetrics/TimersTable';
import HistogramsTable from 'in-sdk/components/dashboard/customMetrics/HistogramsTable';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { emptyList } from 'in-services/fixedImmutables';

export default function DropwizardMetrics({ snapshot, timeConfig }) {
  const gauges = snapshot.getIn(['data', 'metrics.gauges'], emptyList).toArray();
  const counters = snapshot.getIn(['data', 'metrics.counters'], emptyList).toArray();
  const histograms = snapshot.getIn(['data', 'metrics.histograms'], emptyList).toArray();
  const meters = snapshot.getIn(['data', 'metrics.meters'], emptyList).toArray();
  const timers = snapshot.getIn(['data', 'metrics.timers'], emptyList).toArray();

  if (
    gauges.length === 0 &&
    counters.length === 0 &&
    histograms.length === 0 &&
    meters.length === 0 &&
    timers.length === 0
  ) {
    return null;
  }

  return (
    <div>
      <DashboardSection title={`Dropwizard Metrics`}>
        <GaugesTable snapshot={snapshot} timeConfig={timeConfig} />
        <CountersTable snapshot={snapshot} timeConfig={timeConfig} />
        <MetersTable snapshot={snapshot} timeConfig={timeConfig} />
        <TimersTable snapshot={snapshot} timeConfig={timeConfig} />
        <HistogramsTable snapshot={snapshot} timeConfig={timeConfig} />
      </DashboardSection>
    </div>
  );
}
