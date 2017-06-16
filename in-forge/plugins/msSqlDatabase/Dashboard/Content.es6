import React from 'react';

import DatabasesTable from 'in-forge/plugins/msSqlDatabase/Dashboard/DatabasesTable';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import DashboardNotification from 'in-components/DashboardNotification';

export default function MsSqlDashboard({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');

  if (sensorConnectionStatus !== 'OK') {
    return (
      <DashboardNotification type="info">
        {sensorConnectionStatus}
      </DashboardNotification>
    );
  }
  return (
    <div>
      <DashboardSection title="Wait-Times (ms) on server">
        <ChartWithLegend
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
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
        <ChartWithLegend
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            metrics: [
              'perfcounters.sqlserver:general statistics\\logins/sec',
              'perfcounters.sqlserver:general statistics\\user connections'
            ],
            labels: ['Logins/sec.', 'Connections'],
            type: 'line'
          }}
        />
      </DashboardSection>

      <DatabasesTable snapshot={snapshot} timeframe={timeframe} />
    </div>
  );
}
