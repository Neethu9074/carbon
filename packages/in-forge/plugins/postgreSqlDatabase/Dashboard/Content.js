import React from 'react';

import {
  activityZeroDecimalPlaces,
  zeroDecimalPlaces,
  percentageTwoDecimalPlaces
} from 'in-services/formatters/number';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DatabasesTable from 'in-forge/plugins/postgreSqlDatabase/Dashboard/DatabasesTable';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import DashboardNotification from 'in-components/DashboardNotification';
import MetricValue from 'in-components/MetricValue';

export default function PostgreSqlDashboard({ snapshot, timeConfig }) {
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');
  if (sensorConnectionStatus !== 'OK') {
    return <DashboardNotification type="info">{sensorConnectionStatus}</DashboardNotification>;
  }
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label="Committed Transactions">
          <MetricValue
            snapshotId={snapshotId}
            metric="totalCommittedTransactions"
            formatter={activityZeroDecimalPlaces}
          />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title="Total Connections">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['total_active_connections'],
            labels: ['Active'],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
        />
      </DashboardSection>
      <DashboardSection title="Connection Usage">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            max: 1,
            formatter: percentageTwoDecimalPlaces,
            metrics: ['max_conn_pct'],
            labels: ['Usage'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DatabasesTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
