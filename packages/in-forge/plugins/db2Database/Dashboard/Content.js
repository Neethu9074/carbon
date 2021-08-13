/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import TopTotalStmtsTable from 'in-forge/plugins/db2Database/Dashboard/TopTotalStmtsTable';
import DiagLogInfoTable from 'in-forge/plugins/db2Database/Dashboard//DiagLogInfoTable';
import LogDiskWaitTable from 'in-forge/plugins/db2Database/Dashboard/LogDiskWaitTable';
import DbUtilitiesTable from 'in-forge/plugins/db2Database/Dashboard/DbUtilitiesTable';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import TopQueriesTable from 'in-forge/plugins/db2Database/Dashboard//TopQueriesTable';
import ContainersTable from 'in-forge/plugins/db2Database/Dashboard/ContainersTable';
import DatabasesTable from 'in-forge/plugins/db2Database/Dashboard/DatabasesTable';
import DbmConfigTable from 'in-forge/plugins/db2Database/Dashboard/DbmConfigTable';
import LockWaitsTable from 'in-forge/plugins/db2Database/Dashboard/LockWaitsTable';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import RunStatsTable from 'in-forge/plugins/db2Database/Dashboard/RunStatsTable';
import DbConfigTable from 'in-forge/plugins/db2Database/Dashboard/DbConfigTable';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number, millis, bytes } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import { emptyList } from 'in-services/fixedImmutables';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function Db2Dashboard({ snapshot, timeConfig }) {
  const data = snapshot.get('data');
  const sensorConnectionStatus = data.get('sensorConnectionStatus', 'OK');
  const statusFormatter = status => {
    switch (status) {
      case 0:
        return 'ACTIVE';
      case 1:
        return 'QUIESCE PENDING';
      case 2:
        return 'QUIESCED';
      case 3:
        return 'ROLLFORWARD IN PROGRESS';
      case 4:
        return 'READ-ENABLED HADR STANDBY DB';
      case 5:
        return 'HADR STANDBY DB';
      default:
        return '-';
    }
  };
  if (sensorConnectionStatus !== 'OK') {
    return <DashboardNotification type="info">{sensorConnectionStatus}</DashboardNotification>;
  }
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.db2Database.dashboard.queries')}>
          <MetricValue snapshotId={snapshotId} metric="databases.queries" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.db2Database.dashboard.status')}>
          <MetricValue snapshotId={snapshotId} metric="databases.status" formatter={statusFormatter} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.db2Database.dashboard.clientConnections')}>
          <MetricValue snapshotId={snapshotId} metric="databases.connectionsCount" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.db2Database.dashboard.connections')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['databases.connectionsCount'],
            labels: [t('in-forge:plugins.db2Database.dashboard.count')],
            formatter: number.compact,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.db2Database.dashboard.rows')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['databases.rowsRead', 'databases.rowsReturned'],
              labels: [
                t('in-forge:plugins.db2Database.dashboard.read'),
                t('in-forge:plugins.db2Database.dashboard.returned')
              ],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.db2Database.dashboard.commitsRollbacks')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['databases.commits', 'databases.rollbacks'],
              labels: [
                t('in-forge:plugins.db2Database.dashboard.commits'),
                t('in-forge:plugins.db2Database.dashboard.rollbacks')
              ],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <DashboardSection title={t('in-forge:plugins.db2Database.dashboard.statements')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['databases.selectQueries', 'databases.mergeQueries'],
            labels: [
              t('in-forge:plugins.db2Database.dashboard.selects'),
              t('in-forge:plugins.db2Database.dashboard.merges')
            ],
            type: 'line',
            formatter: number.compact
          }}
          y2={{
            min: 0,
            metrics: ['databases.ddlQueries', 'databases.uidQueries', 'databases.xQueries'],
            labels: [
              t('in-forge:plugins.db2Database.dashboard.ddls'),
              t('in-forge:plugins.db2Database.dashboard.uids'),
              t('in-forge:plugins.db2Database.dashboard.xqueries')
            ],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.db2Database.dashboard.queries')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['databases.staticQueries', 'databases.dynamicQueries', 'databases.failedQueries'],
            labels: [
              t('in-forge:plugins.db2Database.dashboard.static'),
              t('in-forge:plugins.db2Database.dashboard.dynamic'),
              t('in-forge:plugins.db2Database.dashboard.failed')
            ],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.db2Database.dashboard.bufferPoolDataPages')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: [
              'bufferpools.dataWrites',
              'bufferpools.dataPhysicalReads',
              'bufferpools.dataLogicalReads',
              'bufferpools.temporaryDataPhysicalReads',
              'bufferpools.temporaryDataLogicalReads'
            ],
            labels: [
              t('in-forge:plugins.db2Database.dashboard.physicalWrites'),
              t('in-forge:plugins.db2Database.dashboard.physicalReads'),
              t('in-forge:plugins.db2Database.dashboard.logicalReads'),
              t('in-forge:plugins.db2Database.dashboard.tempPhysicalReads'),
              t('in-forge:plugins.db2Database.dashboard.tempLogicalReads')
            ],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.db2Database.dashboard.bufferPoolIndexPages')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: [
              'bufferpools.indexWrites',
              'bufferpools.indexPhysicalReads',
              'bufferpools.indexLogicalReads',
              'bufferpools.temporaryIndexPhysicalReads',
              'bufferpools.temporaryIndexLogicalReads'
            ],
            labels: [
              t('in-forge:plugins.db2Database.dashboard.physicalWrites'),
              t('in-forge:plugins.db2Database.dashboard.physicalReads'),
              t('in-forge:plugins.db2Database.dashboard.logicalReads'),
              t('in-forge:plugins.db2Database.dashboard.tempPhysicalReads'),
              t('in-forge:plugins.db2Database.dashboard.tempLogicalReads')
            ],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.db2Database.dashboard.bufferPoolXda')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: [
              'bufferpools.xdaDataWrites',
              'bufferpools.xdaDataPhysicalReads',
              'bufferpools.xdaDataLogicalReads',
              'bufferpools.temporaryXdaDataPhysicalReads',
              'bufferpools.temporaryXdaDataLogicalReads'
            ],
            labels: [
              t('in-forge:plugins.db2Database.dashboard.physicalWrites'),
              t('in-forge:plugins.db2Database.dashboard.physicalReads'),
              t('in-forge:plugins.db2Database.dashboard.logicalReads'),
              t('in-forge:plugins.db2Database.dashboard.tempPhysicalReads'),
              t('in-forge:plugins.db2Database.dashboard.tempLogicalReads')
            ],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.db2Database.dashboard.bufferPoolTime')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['bufferpools.physicalReadTime', 'bufferpools.physicalWriteTime'],
            labels: [
              t('in-forge:plugins.db2Database.dashboard.read'),
              t('in-forge:plugins.db2Database.dashboard.write')
            ],
            type: 'line',
            formatter: millis.detailed
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.db2Database.dashboard.logSpace')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['logs.available', 'logs.used'],
              labels: [
                t('in-forge:plugins.db2Database.dashboard.available'),
                t('in-forge:plugins.db2Database.dashboard.used')
              ],
              type: 'line',
              formatter: bytes.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.db2Database.dashboard.logIo')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['logs.readsIO', 'logs.writesIO'],
              labels: [
                t('in-forge:plugins.db2Database.dashboard.reads'),
                t('in-forge:plugins.db2Database.dashboard.writes')
              ],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <DashboardSection title={t('in-forge:plugins.db2Database.dashboard.log')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['logs.reads', 'logs.writes'],
            labels: [
              t('in-forge:plugins.db2Database.dashboard.reads'),
              t('in-forge:plugins.db2Database.dashboard.writes')
            ],
            type: 'line',
            formatter: number.compact
          }}
          y2={{
            min: 0,
            metrics: ['logs.readTime', 'logs.writeTime'],
            labels: [
              t('in-forge:plugins.db2Database.dashboard.readTime'),
              t('in-forge:plugins.db2Database.dashboard.writeTime')
            ],
            type: 'line',
            formatter: millis.detailed
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.db2Database.dashboard.agentStatus')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: [
              'agentstatus.total',
              'agentstatus.uowWaiting',
              'agentstatus.uowExecuting',
              'agentstatus.lockWait',
              'agentstatus.lockEscalation',
              'agentstatus.other'
            ],
            labels: [
              t('in-forge:plugins.db2Database.total'),
              t('in-forge:plugins.db2Database.uowWaiting'),
              t('in-forge:plugins.db2Database.uowExecuting'),
              t('in-forge:plugins.db2Database.lockWait'),
              t('in-forge:plugins.db2Database.lockEscalation'),
              t('in-forge:plugins.db2Database.other')
            ],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.db2Database.dashboard.dbmConfigUsage')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: [
              'dbmconfigusage.omsCons',
              'dbmconfigusage.omsConsExec',
              'dbmconfigusage.agentHighWmark',
              'dbmconfigusage.coordAgentsHighWmark',
              'dbmconfigusage.agentCreatedVSReused'
            ],
            labels: [
              t('in-forge:plugins.db2Database.omsCons'),
              t('in-forge:plugins.db2Database.omsConsExec'),
              t('in-forge:plugins.db2Database.agentHighWmark'),
              t('in-forge:plugins.db2Database.coordAgentsHighWmark'),
              t('in-forge:plugins.db2Database.agentCreatedVSReused')
            ],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.db2Database.dashboard.workloadStats')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: [
              'workloadstats.appCommits',
              'workloadstats.appRollback',
              'workloadstats.lockTimeouts',
              'workloadstats.deadlocks'
            ],
            labels: [
              t('in-forge:plugins.db2Database.appCommits'),
              t('in-forge:plugins.db2Database.appRollback'),
              t('in-forge:plugins.db2Database.lockTimeouts'),
              t('in-forge:plugins.db2Database.deadlocks')
            ],
            type: 'line',
            formatter: number.compact
          }}
          y2={{
            min: 0,
            metrics: [
              'workloadstats.totalNetTime',
              'workloadstats.totalRequestTime',
              'workloadstats.totalWaitTime',
              'workloadstats.totalIOTime'
            ],
            labels: [
              t('in-forge:plugins.db2Database.totalNetTime'),
              t('in-forge:plugins.db2Database.totalRequestTime'),
              t('in-forge:plugins.db2Database.totalWaitTime'),
              t('in-forge:plugins.db2Database.totalIOTime')
            ],
            type: 'line',
            formatter: millis.detailed
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.db2Database.dashboard.topQueriesCount')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['topqueriesstats.topQueriesCount'],
            labels: [t('in-forge:plugins.db2Database.topQueriesCount')],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <TopQueriesTable snapshotId={snapshotId} />
      <DashboardSection title={t('in-forge:plugins.db2Database.dashboard.totalLockWaitElapsedTime')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['elapsedTime.queryCount'],
            labels: [t('in-forge:plugins.db2Database.queryCount')],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <LockWaitsTable snapshotId={snapshotId} />

      {data.get('databaseNames', emptyList).size > 0 && <DatabasesTable snapshot={snapshot} timeConfig={timeConfig} />}

      {data.get('containerNames', emptyList).size > 0 && (
        <ContainersTable snapshot={snapshot} timeConfig={timeConfig} />
      )}
      <TopTotalStmtsTable snapshotId={snapshotId} snapshot={snapshot} timeConfig={timeConfig} />
      <LogDiskWaitTable snapshotId={snapshotId} snapshot={snapshot} timeConfig={timeConfig} />
      <DbUtilitiesTable snapshotId={snapshotId} />
      <DbConfigTable snapshotId={snapshotId} />
      <DbmConfigTable snapshotId={snapshotId} />
      <RunStatsTable snapshotId={snapshotId} />
      <DiagLogInfoTable snapshotId={snapshotId} />
    </div>
  );
}
