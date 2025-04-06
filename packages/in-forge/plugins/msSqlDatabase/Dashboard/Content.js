/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  megaBytes,
  zeroDecimalPlaces,
  bytesZeroDecimalPlaces,
  bytesTwoDecimalPlaces,
  msZeroDecimalPlaces,
  msTwoDecimalPlaces,
  percentagePlainTwoDecimalPlaces,
  number
} from 'in-services/formatters/number';
import DBmarlinNotificationMessage from 'in-forge/plugins/awsRds/Dashboard/DBmarlinNotificationMessage';
import TopQueriesTable from 'in-forge/plugins/msSqlDatabase/Dashboard/TopQueriesTable';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import DatabasesTable from 'in-forge/plugins/msSqlDatabase/Dashboard/DatabasesTable';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
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
            metrics: ['generalstats._total.user_connections', 'generalstats._total.maximum_connections'],
            labels: [
              t('in-forge:plugins.msSqlDatabase.userConnections'),
              t('in-forge:plugins.msSqlDatabase.max_connections')
            ],
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
            formatter: number.detailed,
            tooltipFormatter: number.detailed
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
            formatter: number.detailed,
            tooltipFormatter: number.detailed
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

      <DashboardSection title={t('in-forge:plugins.msSqlDatabase.dbMemory')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['dbmemorystats.db_memory.used', 'dbmemorystats.db_memory.capacity'],
            labels: [
              t('in-forge:plugins.msSqlDatabase.dbmemory_used'),
              t('in-forge:plugins.msSqlDatabase.dbmemory_capacity')
            ],
            type: 'line',
            formatter: megaBytes.detailed,
            tooltipFormatter: megaBytes.detailed
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.msSqlDatabase.virtualMemoryUsed')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['vmemstats.virtual_memory.vmem_used'],
            labels: [t('in-forge:plugins.msSqlDatabase.vmem_used')],
            type: 'line',
            formatter: megaBytes.detailed,
            tooltipFormatter: megaBytes.detailed
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.msSqlDatabase.responseTime')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['resptimestats.response_time.avg_resp_time'],
            labels: [t('in-forge:plugins.msSqlDatabase.response_time_avg')],
            type: 'line',
            formatter: msZeroDecimalPlaces,
            tooltipFormatter: msZeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.msSqlDatabase.dbCacheHit')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['dbcachehitstats.db_cache_hit.rate'],
            labels: [t('in-forge:plugins.msSqlDatabase.db_cache_hit_rate')],
            type: 'line',
            formatter: percentagePlainTwoDecimalPlaces
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
