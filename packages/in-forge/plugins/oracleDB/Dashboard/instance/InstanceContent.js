/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
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
import ListOfQueriesNotUsingBindVeriableInCodeTable from 'in-forge/plugins/oracleDB/Dashboard/Tables/ListOfQueriesNotUsingBindVeriableInCodeTable';
import TopCPUConsumingSessionsLast10MinTable from 'in-forge/plugins/oracleDB/Dashboard/Tables/TopCPUConsumingSessionsLast10MinTable';
import TopTenSQLWithHighIOLast24HrTable from 'in-forge/plugins/oracleDB/Dashboard/Tables/TopTenSQLWithHighIOLast24HrTable';
import TopTenSQLWithHighIOLast1HrTable from 'in-forge/plugins/oracleDB/Dashboard/Tables/TopTenSQLWithHighIOLast1HrTable';
import TopTenCPUConsumingSessionsTable from 'in-forge/plugins/oracleDB/Dashboard/Tables/TopTenCPUConsumingSessionsTable';
import TopCPUQueriesLast24hrTable from 'in-forge/plugins/oracleDB/Dashboard/Tables/TopCPUQueriesLast24hrTable';
import TopElapsedTimeQueriesTable from 'in-forge/plugins/oracleDB/Dashboard/Tables/TopElapsedTimeQueriesTable';
import ActiveSessionHistoryTable from 'in-forge/plugins/oracleDB/Dashboard/Tables/ActiveSessionHistoryTable';
import SQLConsumingMoreCPUTable from 'in-forge/plugins/oracleDB/Dashboard/Tables/SQLConsumingMoreCPUTable';
import ForegroundSessionsTable from 'in-forge/plugins/oracleDB/Dashboard/Tables/ForegroundSessionsTable';
import DBmarlinNotificationMessage from 'in-forge/plugins/awsRds/Dashboard/DBmarlinNotificationMessage';
import TablespaceUsagesTable from 'in-forge/plugins/oracleDB/Dashboard/Tables/TablespaceUsagesTable.js';
import BlockingSessionsTable from 'in-forge/plugins/oracleDB/Dashboard/Tables/BlockingSessionsTable';
import ProcessUtilization from 'in-forge/plugins/oracleDB/Dashboard/Charts/ProcessUtilization';
import ProcessLimitUsage from 'in-forge/plugins/oracleDB/Dashboard/Charts/ProcessLimitUsage';
import SGAPoolSizeTable from 'in-forge/plugins/oracleDB/Dashboard/Tables/SGAPoolSizeTable';
import DbTimePerSecond from 'in-forge/plugins/oracleDB/Dashboard/Charts/DbTimePerSecond';
import DbSlashCpuTime from 'in-forge/plugins/oracleDB/Dashboard/Charts/DbSlashCpuTime';
import ActiveSessions from 'in-forge/plugins/oracleDB/Dashboard/Charts/ActiveSessions';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function OracleDBDashboard({ snapshot, timeConfig }) {
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');
  if (sensorConnectionStatus !== 'OK') {
    return <DashboardNotification type="info">{sensorConnectionStatus}</DashboardNotification>;
  }

  const snapshotId = snapshot.get('id');
  const data = snapshot.get('data');
  const enablePDBMonitoring = data ? data.get('enablePDBMonitoring') : false;
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.oracleDB.runningProcessCount')}>
          <MetricValue snapshotId={snapshotId} metric="stats.runningProcessCount" formatter={number.compact} />
        </KpiKeyValue>
        {enablePDBMonitoring !== true ? (
          <KpiKeyValue label={t('in-forge:plugins.oracleDB.processLimitUsage')}>
            <MetricValue
              snapshotId={snapshotId}
              metric="stats.processUtilization.processLimit"
              formatter={percentage.compact}
            />
          </KpiKeyValue>
        ) : null}
        <KpiKeyValue label={t('in-forge:plugins.oracleDB.activeSessions')}>
          <MetricValue snapshotId={snapshotId} metric="stats.activeSessionsCount" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
      {enablePDBMonitoring !== true ? (
        <Columize>
          <ProcessUtilization snapshot={snapshot} timeConfig={timeConfig} />
          <ProcessLimitUsage snapshot={snapshot} timeConfig={timeConfig} />
          <ActiveSessions snapshot={snapshot} timeConfig={timeConfig} />
        </Columize>
      ) : (
        <ActiveSessions snapshot={snapshot} timeConfig={timeConfig} />
      )}
      <Columize>
        <DbTimePerSecond snapshot={snapshot} timeConfig={timeConfig} />
        <DbSlashCpuTime snapshot={snapshot} timeConfig={timeConfig} />
        <Columize>
          <DashboardSection title={t('in-forge:plugins.oracleDB.diskUsed')}>
            <Chart
              snapshotId={snapshot.get('id')}
              timeConfig={timeConfig}
              height={200}
              y1={{
                formatter: percentage.detailed,
                metrics: ['stats.diskUsedPercentage'],
                labels: [t('in-forge:plugins.oracleDB.Percentage')],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        </Columize>
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
