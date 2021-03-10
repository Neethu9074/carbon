/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import {
  zeroDecimalPlaces,
  bytesZeroDecimalPlaces,
  bytesTwoDecimalPlaces,
  msZeroDecimalPlaces,
  msTwoDecimalPlaces
} from 'in-services/formatters/number';
import DBmarlinNotificationMessage from 'in-forge/plugins/awsRds/Dashboard/DBmarlinNotificationMessage';
import TopQueriesTable from 'in-forge/plugins/msSqlDatabase/Dashboard/TopQueriesTable';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import DatabasesTable from 'in-forge/plugins/msSqlDatabase/Dashboard/DatabasesTable';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { t } from 'in-i18n';

export default function MsSqlDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');

  if (sensorConnectionStatus !== 'OK') {
    return <DashboardNotification type="info">{sensorConnectionStatus}</DashboardNotification>;
  }
  return (
    <div>
      <DashboardSection title={t('in-forge:plugins.msSqlDatabase.connectionsAmpUsers')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['generalstats._total.user_connections'],
            labels: [t('in-forge:plugins.msSqlDatabase.userConnections')],
            type: 'line',
            formatter: zeroDecimalPlaces,
            tooltipFormatter: zeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.msSqlDatabase.waitTimesMsOnServer')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: [
              'waitstats.PAGEIOLATCH_EX.wait_time_ms',
              'waitstats.PAGEIOLATCH_SH.wait_time_ms',
              'waitstats.ASYNC_NETWORK_IO.wait_time_ms',
              'waitstats.CXPACKET.wait_time_ms',
              'waitstats.WRITELOG.wait_time_ms'
            ],
            labels: [
              'Page IO-Latch EX',
              'Page IO-Latch SH',
              t('in-forge:plugins.msSqlDatabase.asyncNetworkIo'),
              'CX-Packet',
              t('in-forge:plugins.msSqlDatabase.writelog')
            ],
            type: 'line',
            formatter: msZeroDecimalPlaces,
            tooltipFormatter: msTwoDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.msSqlDatabase.virtualFileReadsAmpWritesBytes')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['iostats._total.num_of_bytes_read', 'iostats._total.num_of_bytes_written'],
            labels: [t('in-forge:plugins.msSqlDatabase.reads'), t('in-forge:plugins.msSqlDatabase.writes')],
            type: 'line',
            formatter: bytesZeroDecimalPlaces,
            tooltipFormatter: bytesTwoDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.msSqlDatabase.transactions')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['perfcounters.databases._total.write_transactions_sec'],
            labels: [t('in-forge:plugins.msSqlDatabase.writeTransactions')],
            type: 'line',
            formatter: zeroDecimalPlaces,
            tooltipFormatter: zeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.msSqlDatabase.errors')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: [
              'perfcounters.sql_errors.user_errors.errors_sec',
              'perfcounters.sql_errors.db_offline_errors.errors_sec',
              'perfcounters.sql_errors.kill_connection_errors.errors_sec'
            ],
            labels: [
              t('in-forge:plugins.msSqlDatabase.userErrors'),
              t('in-forge:plugins.msSqlDatabase.dbOfflineErrors'),
              t('in-forge:plugins.msSqlDatabase.killConnectionErrors')
            ],
            type: 'line',
            formatter: zeroDecimalPlaces,
            tooltipFormatter: zeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.msSqlDatabase.locks')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: [
              'perfcounters.locks._total.lock_requests_sec',
              'perfcounters.locks._total.number_of_deadlocks_sec'
            ],
            labels: [
              t('in-forge:plugins.msSqlDatabase.lockRequests'),
              t('in-forge:plugins.msSqlDatabase.numberOfDeadlocks')
            ],
            type: 'line',
            formatter: zeroDecimalPlaces,
            tooltipFormatter: zeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DatabasesTable snapshot={snapshot} timeConfig={timeConfig} />

      <TopQueriesTable snapshotId={snapshotId} />

      <DBmarlinNotificationMessage />
    </div>
  );
}
