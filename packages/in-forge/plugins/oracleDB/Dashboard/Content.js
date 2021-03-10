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
  percentageTwoDecimalPlaces
} from 'in-services/formatters/number';
import DBmarlinNotification from 'in-forge/plugins/awsRds/Dashboard/DBmarlinNotification';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import TablespaceUsagesTable from './TablespaceUsagesTable.js';
import { t } from 'in-i18n';

export default function OracleDBDashboard({ snapshot, timeConfig }) {
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');
  if (sensorConnectionStatus !== 'OK') {
    return <DashboardNotification type="info">{sensorConnectionStatus}</DashboardNotification>;
  }

  return (
    <div>
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
            max: 1,
            formatter: hitRateTwoDecimalPlaces,
            metrics: ['stats.cpuTimeDbTimeRatio'],
            labels: [t('in-forge:plugins.oracleDB.ratio')],
            type: 'area'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
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
      <TablespaceUsagesTable snapshot={snapshot} timeConfig={timeConfig} />

      <DBmarlinNotification />
    </div>
  );
}
