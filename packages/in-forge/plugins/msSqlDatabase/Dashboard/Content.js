import React from 'react';

import {
  zeroDecimalPlaces,
  bytesZeroDecimalPlaces,
  bytesTwoDecimalPlaces,
  msZeroDecimalPlaces,
  msTwoDecimalPlaces
} from 'in-services/formatters/number';
import DBmarlinNotification from 'in-forge/plugins/awsRds/Dashboard/DBmarlinNotification';
import TopQueriesTable from 'in-forge/plugins/msSqlDatabase/Dashboard/TopQueriesTable';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import DatabasesTable from 'in-forge/plugins/msSqlDatabase/Dashboard/DatabasesTable';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';

export default function MsSqlDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');

  if (sensorConnectionStatus !== 'OK') {
    return <DashboardNotification type="info">{sensorConnectionStatus}</DashboardNotification>;
  }
  return (
    <div>
      <DashboardSection title="Connections &amp; Users">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['generalstats._total.user_connections'],
            labels: ['User Connections'],
            type: 'line',
            formatter: zeroDecimalPlaces,
            tooltipFormatter: zeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Wait-Times (ms) on server">
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
            labels: ['Page IO-Latch EX', 'Page IO-Latch SH', 'Async Network IO', 'CX-Packet', 'Writelog'],
            type: 'line',
            formatter: msZeroDecimalPlaces,
            tooltipFormatter: msTwoDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Virtual File Reads &amp; Writes (bytes)">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['iostats._total.num_of_bytes_read', 'iostats._total.num_of_bytes_written'],
            labels: ['Reads', 'Writes'],
            type: 'line',
            formatter: bytesZeroDecimalPlaces,
            tooltipFormatter: bytesTwoDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Transactions">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['perfcounters.databases._total.write_transactions_sec'],
            labels: ['Write Transactions'],
            type: 'line',
            formatter: zeroDecimalPlaces,
            tooltipFormatter: zeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Errors">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: [
              'perfcounters.sql_errors.user_errors.errors_sec',
              'perfcounters.sql_errors.db_offline_errors.errors_sec',
              'perfcounters.sql_errors.kill_connection_errors.errors_sec'
            ],
            labels: ['User Errors', 'DB Offline Errors', 'Kill Connection Errors'],
            type: 'line',
            formatter: zeroDecimalPlaces,
            tooltipFormatter: zeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Locks">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: [
              'perfcounters.locks._total.lock_requests_sec',
              'perfcounters.locks._total.number_of_deadlocks_sec'
            ],
            labels: ['Lock Requests', 'Number of Deadlocks'],
            type: 'line',
            formatter: zeroDecimalPlaces,
            tooltipFormatter: zeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DatabasesTable snapshot={snapshot} timeConfig={timeConfig} />

      <TopQueriesTable snapshotId={snapshotId} />

      <DBmarlinNotification />
    </div>
  );
}
