import React from 'react';

import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import DashboardNotification from 'in-components/DashboardNotification';
import Chart from 'in-components/Chart';
import MetricValue from 'in-components/MetricValue';
import { getLabel } from 'in-sdk/snapshot';

import WebAppsTable from './WebAppsTable.es6';

export default function JettyDashboard({ snapshot, timeframe }) {
  const version = snapshot.getIn(['data', 'version']);
  if (!version) {
    return (
      <DashboardNotification type="info">
        Jmx module is not enabled in jetty. Please enable it to be able to collect data.
        You can do so by adding <code>--module=jmx</code> to <code>start.ini</code>.
      </DashboardNotification>
    );
  }

  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiHeading>
          {getLabel(snapshot)}
        </KpiHeading>
        <KpiKeyValue label="Idle Threads">
          <MetricValue snapshotId={snapshotId} metric="idleThreads" />
        </KpiKeyValue>
        <KpiKeyValue label="Total Threads">
          <MetricValue snapshotId={snapshotId} metric="threads" />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title="Queued Thread Pool Stats">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            metrics: ['idleThreads', 'busyThreads', 'threads', 'threadsQueueSize'],
            labels: ['Idle Threads', 'Busy Threads', 'Total Threads', 'Threads Queue Size'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <WebAppsTable snapshot={snapshot} timeframe={timeframe} />
    </div>
  );
}
