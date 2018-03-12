import React from 'react';

import DatabasesTable from 'in-forge/plugins/msSqlDatabase/Dashboard/DatabasesTable';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart';
import DashboardNotification from 'in-components/DashboardNotification';

export default function MsSqlDashboard({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');

  if (sensorConnectionStatus !== 'OK') {
    return <DashboardNotification type="info">{sensorConnectionStatus}</DashboardNotification>;
  }
  return (
    <div>
      <DashboardSection title="Wait-Times (ms) on server">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            metrics: [
              'waitstats.PAGEIOLATCH_EX.wait_time_ms',
              'waitstats.PAGEIOLATCH_SH.wait_time_ms',
              'waitstats.ASYNC_NETWORK_IO.wait_time_ms',
              'waitstats.CXPACKET.wait_time_ms',
              'waitstats.WRITELOG.wait_time_ms'
            ],
            labels: ['Page IO-Latch EX', 'Page IO-Latch SH', 'Async Network IO', 'CX-Packet', 'Writelog'],
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Connections &amp; Users">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            metrics: ['generalstats._total.user_connections'],
            labels: ['User Connections'],
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Reads &amp; Writes (bytes)">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            metrics: ['iostats._total.num_of_bytes_read', 'iostats._total.num_of_bytes_written'],
            labels: ['Reads', 'Writes'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Errors">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            metrics: [
              'perfcounters.sql_errors._total.errors_sec',
              'perfcounters.sql_errors.user_errors.errors_sec',
              'perfcounters.sql_errors.db_offline_errors.errors_sec',
              'perfcounters.sql_errors.kill_connection_errors.errors_sec'
            ],
            labels: ['Total Errors/sec.', 'User Errors/sec.', 'DB Offline Errors/sec.', 'Kill Connection Errors/sec.'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Transactions">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            metrics: ['perfcounters.databases._total.write_transactions_sec'],
            labels: ['Write Transactions/sec.'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Locks">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            metrics: [
              'perfcounters.locks._total.lock_requests_sec',
              'perfcounters.locks._total.number_of_deadlocks_sec'
            ],
            labels: ['Lock Requests/sec.', 'Number of Deadlocks/sec.'],
            type: 'line'
          }}
        />
      </DashboardSection>

      <DatabasesTable snapshot={snapshot} timeframe={timeframe} />
    </div>
  );
}
