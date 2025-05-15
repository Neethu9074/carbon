/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { number, millis, bytes, micros, positiveNumber, percentage } from 'in-services/formatters/number';
import TopTotalStmtsTable from 'in-forge/plugins/db2Database/Dashboard/TopTotalStmtsTable';
import HadrGenericsTable from 'in-forge/plugins/db2Database/Dashboard/HadrGenericsTable';
import DiagLogInfoTable from 'in-forge/plugins/db2Database/Dashboard//DiagLogInfoTable';
import LogDiskWaitTable from 'in-forge/plugins/db2Database/Dashboard/LogDiskWaitTable';
import DbUtilitiesTable from 'in-forge/plugins/db2Database/Dashboard/DbUtilitiesTable';
import PurescaleGeneral from 'in-forge/plugins/db2Database/Dashboard/PurescaleGeneral';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import TopQueriesTable from 'in-forge/plugins/db2Database/Dashboard//TopQueriesTable';
import DatabasesTable from 'in-forge/plugins/db2Database/Dashboard/DatabasesTable';
import DbmConfigTable from 'in-forge/plugins/db2Database/Dashboard/DbmConfigTable';
import LockWaitsTable from 'in-forge/plugins/db2Database/Dashboard/LockWaitsTable';
import TableSpaceUtil from 'in-forge/plugins/db2Database/Dashboard/TableSpaceUtil';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import Db2CfLockTable from 'in-forge/plugins/db2Database/Dashboard/Db2CfLockTable';
import HadrDashboard from 'in-forge/plugins/db2Database/Dashboard/HadrDashboard';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import RunStatsTable from 'in-forge/plugins/db2Database/Dashboard/RunStatsTable';
import DbConfigTable from 'in-forge/plugins/db2Database/Dashboard/DbConfigTable';
import Db2CfScaTable from 'in-forge/plugins/db2Database/Dashboard/Db2CfScaTable';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import SysCatTable from 'in-forge/plugins/db2Database/Dashboard/SysCatTable';
import SysCatIndex from 'in-forge/plugins/db2Database/Dashboard/SysCatIndex';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ReorgTable from 'in-forge/plugins/db2Database/Dashboard/ReorgTable';
import TableSizes from 'in-forge/plugins/db2Database/Dashboard/TableSizes';
import Db2Member from 'in-forge/plugins/db2Database/Dashboard/Db2Member';
import GenericCustomMetrics from 'in-forge/common/GenericCustomMetrics';
import UOWTable from 'in-forge/plugins/db2Database/Dashboard/UOWTable';
import Db2Cf from 'in-forge/plugins/db2Database/Dashboard/Db2Cf';
import Columize from 'in-sdk/components/dashboard/Columize';
import { emptyList } from 'in-services/fixedImmutables';
import BackupDetailsTable from './BackupDetailsTable';
import GrpBufferPoolTable from './GrpBufferPoolTable';
import MetricValue from 'in-components/MetricValue';
import HadrTakeOverInfo from './HadrTakeOverInfo';
import PageAccessTable from './PageAccessTable';
import PkgCacheTable from './PkgCacheTable';
import { t } from 'in-i18n';

export default function Db2Dashboard({ snapshot, timeConfig }) {
  const data = snapshot.get('data');
  const lockAndLongQuery = data.get('lockAndLongQueryInterval', 100);
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

  const backupFormatter = days =>
    days >= 0 ? `${number.compact(days)} ${t('in-forge:plugins.db2Database.daysAgo')}` : undefined;
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
        <KpiKeyValue label={t('in-forge:plugins.db2Database.daysLastBackup')}>
          <MetricValue snapshotId={snapshotId} metric="databases.daysLastBackup" formatter={backupFormatter} />
        </KpiKeyValue>
        {data.get('versionCheck') && <HadrTakeOverInfo snapshotId={snapshotId} timeConfig={timeConfig} />}
        <KpiKeyValue label={t('in-forge:plugins.db2Database.db2MemberNumber')}>
          <MetricValue snapshotId={snapshotId} metric="db2membermetrics.db2MemberNumber" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.db2Database.dashboard.connections')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['databases.connectionsCount', 'databases.uowExecutors'],
            labels: [t('in-forge:plugins.db2Database.dashboard.count'), t('in-forge:plugins.db2Database.uowExecutors')],
            formatter: number.compact,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <PurescaleGeneral snapshotId={snapshotId} />
      <Db2Member snapshotId={snapshotId} />
      <Db2Cf snapshotId={snapshotId} />
      <Db2CfLockTable snapshotId={snapshotId} snapshot={snapshot} timeConfig={timeConfig} />
      <Db2CfScaTable snapshotId={snapshotId} snapshot={snapshot} timeConfig={timeConfig} />
      <PkgCacheTable snapshotId={snapshotId} snapshot={snapshot} timeConfig={timeConfig} />
      <GrpBufferPoolTable snapshotId={snapshotId} snapshot={snapshot} timeConfig={timeConfig} />
      <PageAccessTable snapshotId={snapshotId} />
      <BackupDetailsTable snapshotId={snapshotId} />
      <HadrGenericsTable snapshotId={snapshotId} timeConfig={timeConfig} />
      <HadrDashboard snapshotId={snapshotId} timeConfig={timeConfig} />
      {data.get('tableSpaceNames', emptyList).size > 0 && (
        <TableSpaceUtil snapshotId={snapshotId} timeConfig={timeConfig} />
      )}
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
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.db2Database.dashboard.logBuffer')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['logs.bufferFull', 'logs.dataInBuffer'],
              labels: [
                t('in-forge:plugins.db2Database.logbufferFull'),
                t('in-forge:plugins.db2Database.logdataInBuffer')
              ],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <DashboardSection title={t('in-forge:plugins.db2Database.dashboard.logSpace')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['logs.available', 'logs.used', 'logs.secLogsUsed', 'logs.logUsedTop'],
            labels: [
              t('in-forge:plugins.db2Database.logsAvailable'),
              t('in-forge:plugins.db2Database.dashboard.used'),
              t('in-forge:plugins.db2Database.logsecLogsUsed'),
              t('in-forge:plugins.db2Database.loglogUsedTop')
            ],
            type: 'line',
            formatter: bytes.detailed
          }}
          y2={{
            min: 0,
            metrics: ['logs.secLogsAlloc'],
            labels: [t('in-forge:plugins.db2Database.logsecLogsAlloc')],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.db2Database.dashboard.logSpace')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['logs.availablePercentage'],
            labels: [t('in-forge:plugins.db2Database.availablePercentage')],
            type: 'line',
            formatter: percentage.detailed
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
            metrics: ['logs.readsIO', 'logs.writesIO', 'logs.pagesIO'],
            labels: [
              t('in-forge:plugins.db2Database.logIoReads'),
              t('in-forge:plugins.db2Database.logIoWrites'),
              t('in-forge:plugins.db2Database.logIoPages')
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
            formatter: micros.detailed
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.db2Database.dashboard.logActive')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['logs.appIdXact', 'logs.firstActive', 'logs.lastActive', 'logs.currentActive'],
            labels: [
              t('in-forge:plugins.db2Database.logappIdXact'),
              t('in-forge:plugins.db2Database.logfirstActive'),
              t('in-forge:plugins.db2Database.loglastActive'),
              t('in-forge:plugins.db2Database.logcurrentActive')
            ],
            type: 'line',
            formatter: positiveNumber
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.db2Database.dashboard.logCommits')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['logs.diskReads', 'logs.totalReads', 'logs.buffReads'],
            labels: [
              t('in-forge:plugins.db2Database.logdiskReads'),
              t('in-forge:plugins.db2Database.logtotalReads'),
              t('in-forge:plugins.db2Database.logbuffReads')
            ],
            type: 'line',
            formatter: number
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
              'dbmconfigusage.totalConnections',
              'dbmconfigusage.agentHighWmark',
              'dbmconfigusage.coordAgentsHighWmark',
              'dbmconfigusage.agentCreatedVSReused'
            ],
            labels: [
              t('in-forge:plugins.db2Database.totalConnections'),
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
      <Columize>
        <DashboardSection
          title={t('in-forge:plugins.db2Database.dashboard.topQueriesCount', {
            lockAndLongQueryInterval: lockAndLongQuery
          })}
        >
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
        <DashboardSection title={t('in-forge:plugins.db2Database.dashboard.vmonlockStatsValue')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['vmonlockstats.lockListInUse'],
              labels: [t('in-forge:plugins.db2Database.lockListInUse')],
              type: 'line',
              formatter: bytes.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <DashboardSection title={t('in-forge:plugins.db2Database.dashboard.vmonlockStats')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: [
              'vmonlockstats.lockEscals',
              'vmonlockstats.activeLockWaits',
              'vmonlockstats.averageLockEscalsPerAct',
              'vmonlockstats.lockListValue'
            ],
            labels: [
              t('in-forge:plugins.db2Database.lockEscals'),
              t('in-forge:plugins.db2Database.activeLockWaits'),
              t('in-forge:plugins.db2Database.averageLockEscalsPerAct'),
              t('in-forge:plugins.db2Database.lockListValue')
            ],
            type: 'line',
            formatter: number.compact
          }}
          y2={{
            min: 0,
            metrics: ['vmonlockstats.lockWaitTime'],
            labels: [t('in-forge:plugins.db2Database.lockWaitTime')],
            type: 'line',
            formatter: millis.detailed
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.db2Database.dashboard.databaseVmondeltaStats')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: [
              'databasevmondeltastats.indexReadEfficiency',
              'databasevmondeltastats.sorts',
              'databasevmondeltastats.sortsPerTransactions',
              'databasevmondeltastats.sqls'
            ],
            labels: [
              t('in-forge:plugins.db2Database.indexReadEfficiency'),
              t('in-forge:plugins.db2Database.sorts'),
              t('in-forge:plugins.db2Database.sortsPerTransactions'),
              t('in-forge:plugins.db2Database.sqls')
            ],
            type: 'line',
            formatter: number.compact
          }}
          y2={{
            min: 0,
            metrics: ['databasevmondeltastats.syncReadPercentage', 'databasevmondeltastats.asyncWritePercentage'],
            labels: [
              t('in-forge:plugins.db2Database.syncReadPercentage'),
              t('in-forge:plugins.db2Database.asyncWritePercentage')
            ],
            type: 'line',
            formatter: percentage
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <TopQueriesTable snapshotId={snapshotId} />
      <DashboardSection
        title={t('in-forge:plugins.db2Database.dashboard.totalLockWaitElapsedTime', {
          lockAndLongQueryInterval: lockAndLongQuery
        })}
      >
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

      <TopTotalStmtsTable snapshotId={snapshotId} snapshot={snapshot} timeConfig={timeConfig} />
      <LogDiskWaitTable snapshotId={snapshotId} snapshot={snapshot} timeConfig={timeConfig} />
      <UOWTable snapshotId={snapshotId} />
      <TableSizes snapshotId={snapshotId} snapshot={snapshot} />
      <SysCatTable snapshotId={snapshotId} snapshot={snapshot} />
      <SysCatIndex snapshotId={snapshotId} snapshot={snapshot} />
      <DbUtilitiesTable snapshotId={snapshotId} />
      <DbConfigTable snapshotId={snapshotId} />
      <DbmConfigTable snapshotId={snapshotId} />
      <RunStatsTable snapshotId={snapshotId} />
      <ReorgTable snapshotId={snapshotId} />
      <DiagLogInfoTable snapshotId={snapshotId} />
      <GenericCustomMetrics snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
