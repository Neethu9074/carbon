/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import MetricValue from 'in-components/MetricValue';
import WebAppsTable from './WebAppsTable.js';

export default function JettyDashboard({ snapshot, timeConfig }) {
  const version = snapshot.getIn(['data', 'version']);
  if (!version) {
    return (
      <DashboardNotification type="info">
        Jmx module is not enabled in jetty. Please enable it to be able to collect data. You can do so by adding{' '}
        <code>--module=jmx</code> to <code>start.ini</code>.
      </DashboardNotification>
    );
  }

  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
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
          timeConfig={timeConfig}
          y1={{
            metrics: ['idleThreads', 'busyThreads', 'threads', 'threadsQueueSize'],
            labels: ['Idle Threads', 'Busy Threads', 'Total Threads', 'Threads Queue Size'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <WebAppsTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
