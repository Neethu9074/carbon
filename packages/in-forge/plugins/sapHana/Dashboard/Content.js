/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { zeroDecimalPlaces, bytesTwoDecimalPlaces, percentageZeroDecimalPlaces } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import AlertsTable from './AlertsTable.js';

export default function Dashboard({ snapshot, timeConfig }) {
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');
  if (sensorConnectionStatus !== 'OK') {
    return <DashboardNotification type="info">{sensorConnectionStatus}</DashboardNotification>;
  }

  return (
    <div>
      <DashboardSection title="SAP HANA System Cpu Usage">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: percentageZeroDecimalPlaces,
            metrics: ['stats.cpuUsage'],
            labels: ['Cpu Usage'],
            type: 'area'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="SAP HANA System Memory Usage">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: bytesTwoDecimalPlaces,
            metrics: ['stats.usedMemory', 'stats.residentMemory'],
            labels: ['Used Memory', 'Resident Memory'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Disk Usage">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          height={200}
          y1={{
            formatter: bytesTwoDecimalPlaces,
            metrics: ['stats.diskUsageData', 'stats.diskUsageLog', 'stats.diskUsageTrace'],
            labels: ['Data Size', 'Log Size', 'Trace Size'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Sessions">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          height={200}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: [
              'stats.sessionsTotalCount',
              'stats.sessionsIdleCount',
              'stats.sessionsRunningCount',
              'stats.sessionsBlockedCount',
              'stats.sessionsBlockingCount'
            ],
            labels: ['Total', 'Idle', 'Running', 'Blocked', 'Blocking'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Currently Connected Users and Applications">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          height={200}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: ['stats.sessionsDatabaseUsers', 'stats.sessionsApplications', 'stats.sessionsApplicationUsers'],
            labels: ['Distinct Database Users', 'Distinct Applications', 'Distinct Application Users'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Threads">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          height={200}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: ['stats.threadsTotalCount', 'stats.threadsActiveCount', 'stats.threadsBlockedCount'],
            labels: ['Total', 'Active', 'Blocked'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Job Worker Threads">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          height={200}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: [
              'stats.threadsJobWorkerCount',
              'stats.threadsJobWorkerActiveCount',
              'stats.threadsJobWorkerBlockedCount'
            ],
            labels: ['Total', 'Active', 'Blocked'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="SQL Executor Threads">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          height={200}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: [
              'stats.threadsSqlExecutorCount',
              'stats.threadsSqlExecutorActiveCount',
              'stats.threadsSqlExecutorBlockedCount'
            ],
            labels: ['Total', 'Active', 'Blocked'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Workload">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          height={200}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: [
              'stats.stmtExecutions',
              'stats.stmtCompilations',
              'stats.updateTransactions',
              'stats.rollbacks',
              'stats.commits'
            ],
            labels: ['Statement Executions', 'Statement Compilations', 'Update Transactions', 'Rollbacks', 'Commits'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Requests">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          height={200}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: [
              'stats.indexServerFinishedRequests',
              'stats.indexServerActiveRequests',
              'stats.indexServerPendingRequests'
            ],
            labels: ['Finished Requests', 'Active Requests', 'Pending Requests'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <AlertsTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
