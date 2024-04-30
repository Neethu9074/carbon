/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { zeroDecimalPlaces, bytesTwoDecimalPlaces, percentageZeroDecimalPlaces } from 'in-services/formatters/number';
import ExpensiveStatementStatsList from 'in-forge/plugins/sapHana/Dashboard/ExpensiveStatementStats';
import GarbageCollectionStatsList from 'in-forge/plugins/sapHana/Dashboard/GarbageCollectionStats';
import SqlPlanCacheStatsList from 'in-forge/plugins/sapHana/Dashboard/SqlPlanCacheStats';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import LockWaitStatsList from 'in-forge/plugins/sapHana/Dashboard/LockWaitStats';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import AlertsTable from './AlertsTable';
import { t } from 'in-i18n';

interface DashboardProps {
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}

export default function Dashboard({ snapshot, timeConfig }: DashboardProps) {
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');
  if (sensorConnectionStatus !== 'OK') {
    return <DashboardNotification type="info">{sensorConnectionStatus}</DashboardNotification>;
  }

  return (
    <div>
      <DashboardSection title={t('in-forge:plugins.sapHana.dashboard.sapHanaSystemCpuUsage')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: percentageZeroDecimalPlaces,
            metrics: ['stats.cpuUsage'],
            labels: [t('in-forge:plugins.sapHana.dashboard.cpuUsage')],
            type: 'area'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.sapHana.dashboard.sapHanaSystemMemoryUsage')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: bytesTwoDecimalPlaces,
            metrics: ['stats.usedMemory', 'stats.residentMemory'],
            labels: [
              t('in-forge:plugins.sapHana.dashboard.usedMemory'),
              t('in-forge:plugins.sapHana.dashboard.residentMemory')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.sapHana.dashboard.diskUsage')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: bytesTwoDecimalPlaces,
            metrics: ['stats.diskUsageData', 'stats.diskUsageLog', 'stats.diskUsageTrace'],
            labels: [
              t('in-forge:plugins.sapHana.dashboard.dataSize'),
              t('in-forge:plugins.sapHana.dashboard.logSize'),
              t('in-forge:plugins.sapHana.dashboard.traceSize')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.sapHana.dashboard.sessions')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: [
              'stats.sessionsTotalCount',
              'stats.sessionsIdleCount',
              'stats.sessionsRunningCount',
              'stats.sessionsBlockedCount',
              'stats.sessionsBlockingCount'
            ],
            labels: [
              t('in-forge:plugins.sapHana.dashboard.total'),
              t('in-forge:plugins.sapHana.dashboard.idle'),
              t('in-forge:plugins.sapHana.dashboard.running'),
              t('in-forge:plugins.sapHana.dashboard.blocked'),
              t('in-forge:plugins.sapHana.dashboard.blocking')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.sapHana.dashboard.currentlyConnectedUsersAndApplications')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: ['stats.sessionsDatabaseUsers', 'stats.sessionsApplications', 'stats.sessionsApplicationUsers'],
            labels: [
              t('in-forge:plugins.sapHana.dashboard.distinctDatabaseUsers'),
              t('in-forge:plugins.sapHana.dashboard.distinctApplications'),
              t('in-forge:plugins.sapHana.dashboard.distinctApplicationUsers')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.sapHana.dashboard.threads')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: ['stats.threadsTotalCount', 'stats.threadsActiveCount', 'stats.threadsBlockedCount'],
            labels: [
              t('in-forge:plugins.sapHana.dashboard.total'),
              t('in-forge:plugins.sapHana.dashboard.active'),
              t('in-forge:plugins.sapHana.dashboard.blocked')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.sapHana.dashboard.jobWorkerThreads')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: [
              'stats.threadsJobWorkerCount',
              'stats.threadsJobWorkerActiveCount',
              'stats.threadsJobWorkerBlockedCount'
            ],
            labels: [
              t('in-forge:plugins.sapHana.dashboard.total'),
              t('in-forge:plugins.sapHana.dashboard.active'),
              t('in-forge:plugins.sapHana.dashboard.blocked')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.sapHana.dashboard.sqlExecutorThreads')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: [
              'stats.threadsSqlExecutorCount',
              'stats.threadsSqlExecutorActiveCount',
              'stats.threadsSqlExecutorBlockedCount'
            ],
            labels: [
              t('in-forge:plugins.sapHana.dashboard.total'),
              t('in-forge:plugins.sapHana.dashboard.active'),
              t('in-forge:plugins.sapHana.dashboard.blocked')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.sapHana.dashboard.workload')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: [
              'stats.stmtExecutions',
              'stats.stmtCompilations',
              'stats.updateTransactions',
              'stats.rollbacks',
              'stats.commits'
            ],
            labels: [
              t('in-forge:plugins.sapHana.dashboard.statementExecutions'),
              t('in-forge:plugins.sapHana.dashboard.statementCompilations'),
              t('in-forge:plugins.sapHana.dashboard.updateTransactions'),
              t('in-forge:plugins.sapHana.dashboard.rollbacks'),
              t('in-forge:plugins.sapHana.dashboard.commits')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.sapHana.dashboard.requests')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: [
              'stats.indexServerFinishedRequests',
              'stats.indexServerActiveRequests',
              'stats.indexServerPendingRequests'
            ],
            labels: [
              t('in-forge:plugins.sapHana.dashboard.finishedRequests'),
              t('in-forge:plugins.sapHana.dashboard.activeRequests'),
              t('in-forge:plugins.sapHana.dashboard.pendingRequests')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.sapHana.dashboard.connections')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: ['stats.idleCount', 'stats.runningCount', 'stats.queueingCount'],
            labels: [
              t('in-forge:plugins.sapHana.dashboard.idleCount'),
              t('in-forge:plugins.sapHana.dashboard.runningCount'),
              t('in-forge:plugins.sapHana.dashboard.queueingCount')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <GarbageCollectionStatsList snapshotId={snapshot.get('id')} timeConfig={timeConfig} />
      <ExpensiveStatementStatsList snapshotId={snapshot.get('id')} timeConfig={timeConfig} />
      <SqlPlanCacheStatsList snapshotId={snapshot.get('id')} timeConfig={timeConfig} />
      <LockWaitStatsList snapshotId={snapshot.get('id')} timeConfig={timeConfig} />
      <AlertsTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
