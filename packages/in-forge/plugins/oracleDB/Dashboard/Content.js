/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  number,
  millis,
  micros,
  hitRateTwoDecimalPlaces,
  percentageTwoDecimalPlaces,
  percentage,
  megaBytes
} from 'in-services/formatters/number';
import ListOfQueriesNotUsingBindVeriableInCodeTable from './Tables/ListOfQueriesNotUsingBindVeriableInCodeTable';
import DBmarlinNotificationMessage from 'in-forge/plugins/awsRds/Dashboard/DBmarlinNotificationMessage';
import TopCPUConsumingSessionsLast10MinTable from './Tables/TopCPUConsumingSessionsLast10MinTable';
import TopTenSQLWithHighIOLast24HrTable from './Tables/TopTenSQLWithHighIOLast24HrTable';
import TopTenSQLWithHighIOLast1HrTable from './Tables/TopTenSQLWithHighIOLast1HrTable';
import TopTenCPUConsumingSessionsTable from './Tables/TopTenCPUConsumingSessionsTable';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import TopCPUQueriesLast24hrTable from './Tables/TopCPUQueriesLast24hrTable';
import TopElapsedTimeQueriesTable from './Tables/TopElapsedTimeQueriesTable';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ActiveSessionHistoryTable from './Tables/ActiveSessionHistoryTable';
import SQLConsumingMoreCPUTable from './Tables/SQLConsumingMoreCPUTable';
import ForegroundSessionsTable from './Tables/ForegroundSessionsTable';
import TablespaceUsagesTable from './Tables/TablespaceUsagesTable.js';
import BlockingSessionsTable from './Tables/BlockingSessionsTable';
import SGAPoolSizeTable from './Tables/SGAPoolSizeTable.js';
import Columize from 'in-sdk/components/dashboard/Columize';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function OracleDBDashboard({ snapshot, timeConfig }) {
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');
  if (sensorConnectionStatus !== 'OK') {
    return <DashboardNotification type="info">{sensorConnectionStatus}</DashboardNotification>;
  }

  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.oracleDB.runningProcessCount')}>
          <MetricValue snapshotId={snapshotId} metric="stats.runningProcessCount" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.oracleDB.processLimitUsage')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="stats.processUtilization.processLimit"
            formatter={percentage.compact}
          />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.oracleDB.activeSessions')}>
          <MetricValue snapshotId={snapshotId} metric="stats.activeSessionsCount" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.oracleDB.processUtilization')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: [
                'stats.processUtilization.maxUtilization',
                'stats.processUtilization.currentUtilization',
                'stats.processUtilization.initialAllocation',
                'stats.processUtilization.limitValue'
              ],
              labels: [
                t('in-forge:plugins.oracleDB.processMaxUtilization'),
                t('in-forge:plugins.oracleDB.processCurrentUtilization'),
                t('in-forge:plugins.oracleDB.processInitialAllocation'),
                t('in-forge:plugins.oracleDB.processLimitValue')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.oracleDB.processLimitUsage')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: percentage.detailed,
              min: 0,
              max: 1,
              metrics: ['stats.processUtilization.processLimit'],
              labels: [t('in-forge:plugins.oracleDB.processLimit')],
              type: 'area'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.oracleDB.activeSessions')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: number.detailed,
              min: 0,
              max: 1,
              metrics: ['stats.activeSessionsCount'],
              labels: [t('in-forge:plugins.oracleDB.count')],
              type: 'area'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.oracleDB.dbTimePerSecond')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: micros.detailed,
              metrics: ['stats.dbTime', 'stats.cpuTime', 'stats.sqlExecuteTime', 'stats.parseTime'],
              labels: [
                t('in-forge:plugins.oracleDB.db'),
                t('in-forge:plugins.oracleDB.dbCpu'),
                t('in-forge:plugins.oracleDB.sqlExecute'),
                t('in-forge:plugins.oracleDB.parse')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.oracleDB.dbSlashCpuTime')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: hitRateTwoDecimalPlaces,
              metrics: ['stats.cpuTimeDbTimeRatio'],
              labels: [t('in-forge:plugins.oracleDB.ratio')],
              type: 'area'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.oracleDB.timeWaitedPerSecond')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            height={200}
            y1={{
              formatter: millis.detailed,
              metrics: [
                'stats.timeWaited.userIO',
                'stats.timeWaited.other',
                'stats.timeWaited.systemIO',
                'stats.timeWaited.concurrency',
                'stats.timeWaited.scheduler',
                'stats.timeWaited.application',
                'stats.timeWaited.commit',
                'stats.timeWaited.configuration',
                'stats.timeWaited.administrative',
                'stats.timeWaited.network',
                'stats.timeWaited.queue'
              ],
              labels: [
                t('in-forge:plugins.oracleDB.userIO'),
                t('in-forge:plugins.oracleDB.other'),
                t('in-forge:plugins.oracleDB.systemIO'),
                t('in-forge:plugins.oracleDB.concurrency'),
                t('in-forge:plugins.oracleDB.scheduler'),
                t('in-forge:plugins.oracleDB.application'),
                t('in-forge:plugins.oracleDB.commit'),
                t('in-forge:plugins.oracleDB.configuration'),
                t('in-forge:plugins.oracleDB.administrative'),
                t('in-forge:plugins.oracleDB.network'),
                t('in-forge:plugins.oracleDB.queueing')
              ],
              type: 'stackedArea'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.oracleDB.libraryCacheHitRatio')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            height={200}
            y1={{
              formatter: percentage.detailed,
              metrics: [
                'stats.libraryCacheHitRatios.bufferCache',
                'stats.libraryCacheHitRatios.executeNoParse',
                'stats.libraryCacheHitRatios.memorySort',
                'stats.libraryCacheHitRatios.sqlAreaGetHitRate',
                'stats.libraryCacheHitRatios.avgLatchHitNoMiss',
                'stats.libraryCacheHitRatios.avgLatchHitNoSleep'
              ],
              labels: [
                t('in-forge:plugins.oracleDB.bufferCache'),
                t('in-forge:plugins.oracleDB.executeNoParse'),
                t('in-forge:plugins.oracleDB.memorySort'),
                t('in-forge:plugins.oracleDB.sqlAreaGetHitRate'),
                t('in-forge:plugins.oracleDB.avgLatchHitNoMiss'),
                t('in-forge:plugins.oracleDB.avgLatchHitNoSleep')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.oracleDB.sgaMemory')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: megaBytes.detailed,
              metrics: ['stats.usageOfSGA.total', 'stats.usageOfSGA.used', 'stats.usageOfSGA.free'],
              labels: [
                t('in-forge:plugins.oracleDB.totalMemory'),
                t('in-forge:plugins.oracleDB.usedMemory'),
                t('in-forge:plugins.oracleDB.freeMemory')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <SGAPoolSizeTable snapshot={snapshot} timeConfig={timeConfig} />
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.oracleDB.sqlExecution')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['stats.sqlExecuteCount'],
              labels: [t('in-forge:plugins.oracleDB.count')],
              type: 'line'
            }}
            y2={{
              formatter: micros.detailed,
              metrics: ['stats.averageSqlExecuteTime'],
              labels: [t('in-forge:plugins.oracleDB.averageTime')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.oracleDB.sqlParseCount')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['stats.hardParseCount', 'stats.totalParseCount'],
              labels: [t('in-forge:plugins.oracleDB.hardParse'), t('in-forge:plugins.oracleDB.totalParse')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.oracleDB.sqlParseRatios')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              max: 1,
              formatter: hitRateTwoDecimalPlaces,
              metrics: ['stats.softTotalParsesRatio', 'stats.executesWithoutParsesRatio'],
              labels: [t('in-forge:plugins.oracleDB.softTotal'), t('in-forge:plugins.oracleDB.withoutParses')],
              type: 'area'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.oracleDB.userCallsCommitsRollbacks')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: [
                'stats.userCalls',
                'stats.recursiveCalls',
                'stats.userCommits',
                'stats.userRollbacks',
                'stats.userLogOns'
              ],
              labels: [
                t('in-forge:plugins.oracleDB.userCalls'),
                t('in-forge:plugins.oracleDB.recursiveCalls'),
                t('in-forge:plugins.oracleDB.userCommits'),
                t('in-forge:plugins.oracleDB.userRollbacks'),
                t('in-forge:plugins.oracleDB.userLogOns')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.oracleDB.bufferCacheHit')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              max: 1,
              formatter: hitRateTwoDecimalPlaces,
              metrics: ['stats.bufferCacheHitRatio'],
              labels: [t('in-forge:plugins.oracleDB.ratio')],
              type: 'area'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.oracleDB.physicalAndSessionLogicalReads')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['stats.physicalReads', 'stats.sessionLogicalReads'],
              labels: [t('in-forge:plugins.oracleDB.physical'), t('in-forge:plugins.oracleDB.logical')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.oracleDB.sessions')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['stats.activeUserSessions', 'stats.inactiveUserSessions', 'stats.backgroundSessions'],
              labels: [
                t('in-forge:plugins.oracleDB.activeUser'),
                t('in-forge:plugins.oracleDB.inactiveUser'),
                t('in-forge:plugins.oracleDB.background')
              ],
              type: 'stackedArea'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.oracleDB.usedSessionsRatio')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              max: 1,
              formatter: percentageTwoDecimalPlaces,
              metrics: ['stats.usedSessionsRatio'],
              labels: [t('in-forge:plugins.oracleDB.sessionsSessionLimit')],
              type: 'area'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <TablespaceUsagesTable snapshot={snapshot} timeConfig={timeConfig} />
      <BlockingSessionsTable snapshot={snapshot} />
      <TopCPUQueriesLast24hrTable snapshot={snapshot} />
      <ListOfQueriesNotUsingBindVeriableInCodeTable snapshot={snapshot} />
      <TopElapsedTimeQueriesTable snapshot={snapshot} />
      <ActiveSessionHistoryTable snapshot={snapshot} />
      <TopTenCPUConsumingSessionsTable snapshot={snapshot} />
      <TopCPUConsumingSessionsLast10MinTable snapshot={snapshot} />
      <TopTenSQLWithHighIOLast1HrTable snapshot={snapshot} />
      <TopTenSQLWithHighIOLast24HrTable snapshot={snapshot} />
      <SQLConsumingMoreCPUTable snapshot={snapshot} />
      <ForegroundSessionsTable snapshot={snapshot} />
      <DBmarlinNotificationMessage />
    </div>
  );
}
