/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import UserCallsCommitsRollbacksDetailsTable from '../Tables/UserCallsCommitsRollbacksDetailsTable';
import TopCPUConsumingSessionsLast10MinTable from '../Tables/TopCPUConsumingSessionsLast10MinTable';
import PhysicalAndSessionLogicalReadsTable from '../Tables/PhysicalAndSessionLogicalReadsTable';
import SQLExecutionAndParseDetailsTable from '../Tables/SQLExecutionAndParseDetailsTable';
import TopTenCPUConsumingSessionsTable from '../Tables/TopTenCPUConsumingSessionsTable';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import TopElapsedTimeQueriesTable from '../Tables/TopElapsedTimeQueriesTable';
import ActiveSessionHistoryTable from '../Tables/ActiveSessionHistoryTable';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import SQLConsumingMoreCPUTable from '../Tables/SQLConsumingMoreCPUTable';
import ProcessUtilizationTable from '../Tables/ProcessUtilizationTable';
import ForegroundSessionsTable from '../Tables/ForegroundSessionsTable';
import BlockingSessionsTable from '../Tables/BlockingSessionsTable';
import { number, megaBytes } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import SGAPoolSizeTable from '../Tables/SGAPoolSizeTable';
import BufferCacheTable from '../Tables/BufferCacheTable';
import DBDetailsTable from '../Tables/DBDetailsTable';
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
        <KpiKeyValue label={t('in-forge:plugins.oracleDB.activeSessions')}>
          <MetricValue snapshotId={snapshotId} metric="stats.activeSessionsCount" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
      <Columize>
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
      <ProcessUtilizationTable snapshot={snapshot} timeConfig={timeConfig} />
      <DBDetailsTable snapshot={snapshot} timeConfig={timeConfig} />
      <SQLExecutionAndParseDetailsTable snapshot={snapshot} timeConfig={timeConfig} />
      <Columize>
        <BufferCacheTable snapshot={snapshot} timeConfig={timeConfig} />
        <PhysicalAndSessionLogicalReadsTable snapshot={snapshot} timeConfig={timeConfig} />
      </Columize>
      <UserCallsCommitsRollbacksDetailsTable snapshot={snapshot} timeConfig={timeConfig} />
      <TopCPUConsumingSessionsLast10MinTable snapshot={snapshot} />
      <ForegroundSessionsTable snapshot={snapshot} />
      <TopElapsedTimeQueriesTable snapshot={snapshot} />
      <TopTenCPUConsumingSessionsTable snapshot={snapshot} />
      <ActiveSessionHistoryTable snapshot={snapshot} />
      <SQLConsumingMoreCPUTable snapshot={snapshot} />
      <BlockingSessionsTable snapshot={snapshot} />
    </div>
  );
}
