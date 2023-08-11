/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import ListOfQueriesNotUsingBindVeriableInCodeTable from 'in-forge/plugins/oracleDB/Dashboard/Tables/ListOfQueriesNotUsingBindVeriableInCodeTable';
import UserCallsCommitsRollbacksDetailsTable from 'in-forge/plugins/oracleDB/Dashboard/Tables/UserCallsCommitsRollbacksDetailsTable';
import TopCPUConsumingSessionsLast10MinTable from 'in-forge/plugins/oracleDB/Dashboard/Tables/TopCPUConsumingSessionsLast10MinTable';
import PhysicalAndSessionLogicalReadsTable from 'in-forge/plugins/oracleDB/Dashboard/Tables/PhysicalAndSessionLogicalReadsTable';
import SQLExecutionAndParseDetailsTable from 'in-forge/plugins/oracleDB/Dashboard/Tables/SQLExecutionAndParseDetailsTable';
import TopTenSQLWithHighIOLast24HrTable from 'in-forge/plugins/oracleDB/Dashboard/Tables/TopTenSQLWithHighIOLast24HrTable';
import TopTenSQLWithHighIOLast1HrTable from 'in-forge/plugins/oracleDB/Dashboard/Tables/TopTenSQLWithHighIOLast1HrTable';
import TopTenCPUConsumingSessionsTable from 'in-forge/plugins/oracleDB/Dashboard/Tables/TopTenCPUConsumingSessionsTable';
import TopElapsedTimeQueriesTable from 'in-forge/plugins/oracleDB/Dashboard/Tables/TopElapsedTimeQueriesTable';
import LibraryCacheHitRatiosTable from 'in-forge/plugins/oracleDB/Dashboard/Tables/LibraryCacheHitRatiosTable';
import ActiveSessionHistoryTable from 'in-forge/plugins/oracleDB/Dashboard/Tables/ActiveSessionHistoryTable';
import SQLConsumingMoreCPUTable from 'in-forge/plugins/oracleDB/Dashboard/Tables/SQLConsumingMoreCPUTable';
import ProcessUtilizationTable from 'in-forge/plugins/oracleDB/Dashboard/Tables/ProcessUtilizationTable';
import ForegroundSessionsTable from 'in-forge/plugins/oracleDB/Dashboard/Tables/ForegroundSessionsTable';
import TablespaceUsagesTable from 'in-forge/plugins/oracleDB/Dashboard/Tables/TablespaceUsagesTable.js';
import BlockingSessionsTable from 'in-forge/plugins/oracleDB/Dashboard/Tables/BlockingSessionsTable';
import SGAPoolSizeTable from 'in-forge/plugins/oracleDB/Dashboard/Tables/SGAPoolSizeTable';
import BufferCacheTable from 'in-forge/plugins/oracleDB/Dashboard/Tables/BufferCacheTable';
import TimeWaitedTable from 'in-forge/plugins/oracleDB/Dashboard/Tables/TimeWaitedTable';
import DBDetailsTable from 'in-forge/plugins/oracleDB/Dashboard/Tables/DBDetailsTable';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number, megaBytes } from 'in-services/formatters/number';
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
      <TablespaceUsagesTable snapshot={snapshot} timeConfig={timeConfig} />
      <TimeWaitedTable snapshot={snapshot} timeConfig={timeConfig} />
      <UserCallsCommitsRollbacksDetailsTable snapshot={snapshot} timeConfig={timeConfig} />
      <LibraryCacheHitRatiosTable snapshot={snapshot} timeConfig={timeConfig} />
      <TopCPUConsumingSessionsLast10MinTable snapshot={snapshot} />
      <ForegroundSessionsTable snapshot={snapshot} />
      <TopElapsedTimeQueriesTable snapshot={snapshot} />
      <TopTenCPUConsumingSessionsTable snapshot={snapshot} />
      <ActiveSessionHistoryTable snapshot={snapshot} />
      <SQLConsumingMoreCPUTable snapshot={snapshot} />
      <BlockingSessionsTable snapshot={snapshot} />
      <TopTenSQLWithHighIOLast1HrTable snapshot={snapshot} />
      <TopTenSQLWithHighIOLast24HrTable snapshot={snapshot} />
      <ListOfQueriesNotUsingBindVeriableInCodeTable snapshot={snapshot} />
    </div>
  );
}
