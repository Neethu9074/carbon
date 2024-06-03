/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import {
  zeroDecimalPlaces,
  bytesTwoDecimalPlaces,
  percentageZeroDecimalPlaces,
  millis
} from 'in-services/formatters/number';
import ExpensiveStatementStatsList from 'in-forge/plugins/sapHana/Dashboard/ExpensiveStatementStats';
import GarbageCollectionStatsList from 'in-forge/plugins/sapHana/Dashboard/GarbageCollectionStats';
import AggregatedCacheStatsList from 'in-forge/plugins/sapHana/Dashboard/AggregatedCacheStats';
import ServiceDetailsStatsList from 'in-forge/plugins/sapHana/Dashboard/ServiceDetailsStats';
import SqlPlanCacheStatsList from 'in-forge/plugins/sapHana/Dashboard/SqlPlanCacheStats';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import TableSizeStatsList from 'in-forge/plugins/sapHana/Dashboard/TableSizeStats';
import LockWaitStatsList from 'in-forge/plugins/sapHana/Dashboard/LockWaitStats';
import NetworkStatsList from 'in-forge/plugins/sapHana/Dashboard/NetworkStats';
import BackupStatsList from 'in-forge/plugins/sapHana/Dashboard/BackupStats';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
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
      <Columize>
        <DashboardSection title={t('in-forge:plugins.sapHana.dashboard.totalCpuUtilization')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: percentageZeroDecimalPlaces,
              metrics: ['stats.cpuUsage'],
              labels: [t('in-forge:plugins.sapHana.dashboard.totalCpuUtilization')],
              type: 'area'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.sapHana.dashboard.cpuTimeSpent')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: millis.detailed,
              metrics: ['stats.totalCpuUserTime', 'stats.totalCpuSystemTime', 'stats.totalCpuIdleTime'],
              labels: [
                t('in-forge:plugins.sapHana.dashboard.totalCpuUserTime'),
                t('in-forge:plugins.sapHana.dashboard.totalCpuSystemTime'),
                t('in-forge:plugins.sapHana.dashboard.idle')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
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
                t('in-forge:plugins.sapHana.dashboard.active'),
                t('in-forge:plugins.sapHana.dashboard.pendingRequests')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.sapHana.dashboard.hanaMemoryUsage')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: bytesTwoDecimalPlaces,
              metrics: ['stats.usedMemory', 'stats.instanceTotalMemoryPeakUsed', 'stats.allocationLimit'],
              labels: [
                t('in-forge:plugins.sapHana.dashboard.used'),
                t('in-forge:plugins.sapHana.dashboard.peakUsed'),
                t('in-forge:plugins.sapHana.dashboard.allocationLimit')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.sapHana.dashboard.hostMemoryUsage')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: bytesTwoDecimalPlaces,
              metrics: ['stats.freePhysicalMemory', 'stats.usedPhysicalMemory', 'stats.totalPhysicalMemory'],
              labels: [
                t('in-forge:plugins.sapHana.dashboard.freeMemory'),
                t('in-forge:plugins.sapHana.dashboard.totalResident'),
                t('in-forge:plugins.sapHana.dashboard.physicalMemory')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.sapHana.dashboard.heapMemory')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: bytesTwoDecimalPlaces,
              metrics: ['stats.totalHeapUsed', 'stats.totalHeapAllocated'],
              labels: [t('in-forge:plugins.sapHana.dashboard.used'), t('in-forge:plugins.sapHana.dashboard.allocated')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.sapHana.dashboard.swapMemory')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: bytesTwoDecimalPlaces,
              metrics: ['stats.freeSwapSpace', 'stats.usedSwapSpace'],
              labels: [t('in-forge:plugins.sapHana.dashboard.free'), t('in-forge:plugins.sapHana.dashboard.used')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
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
      <Columize>
        <DashboardSection title={t('in-forge:plugins.sapHana.dashboard.connections')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['stats.idleCount', 'stats.queueingCount', 'stats.runningCount'],
              labels: [
                t('in-forge:plugins.sapHana.dashboard.idle'),
                t('in-forge:plugins.sapHana.dashboard.queueingCount'),
                t('in-forge:plugins.sapHana.dashboard.running')
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
              metrics: ['stats.sessionsDatabaseUsers', 'stats.sessionsApplicationUsers', 'stats.sessionsApplications'],
              labels: [
                t('in-forge:plugins.sapHana.dashboard.distinctDatabaseUsers'),
                t('in-forge:plugins.sapHana.dashboard.distinctApplicationUsers'),
                t('in-forge:plugins.sapHana.dashboard.distinctApplications')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
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
      </Columize>
      <ServiceDetailsStatsList snapshotId={snapshot.get('id')} timeConfig={timeConfig} />
      <GarbageCollectionStatsList snapshotId={snapshot.get('id')} timeConfig={timeConfig} />
      <ExpensiveStatementStatsList snapshotId={snapshot.get('id')} timeConfig={timeConfig} />
      <SqlPlanCacheStatsList snapshotId={snapshot.get('id')} timeConfig={timeConfig} />
      <LockWaitStatsList snapshotId={snapshot.get('id')} timeConfig={timeConfig} />
      <NetworkStatsList snapshotId={snapshot.get('id')} timeConfig={timeConfig} />
      <TableSizeStatsList snapshotId={snapshot.get('id')} timeConfig={timeConfig} />
      <AggregatedCacheStatsList snapshotId={snapshot.get('id')} timeConfig={timeConfig} />
      <BackupStatsList snapshotId={snapshot.get('id')} timeConfig={timeConfig} />
      <AlertsTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
