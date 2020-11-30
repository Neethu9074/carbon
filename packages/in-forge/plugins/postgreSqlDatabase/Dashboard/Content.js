import React from 'react';

import {
  activityZeroDecimalPlaces,
  zeroDecimalPlaces,
  percentageTwoDecimalPlaces,
  bytesZeroDecimalPlaces,
  seconds
} from 'in-services/formatters/number';
import DBmarlinNotification from 'in-integrations/database/dbmarlin/DBmarlinNotification';
import DatabasesTable from 'in-forge/plugins/postgreSqlDatabase/Dashboard/DatabasesTable';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { agentMonitoringIssuesEnabled } from 'in-services/featureFlags';
import MetricValue from 'in-components/MetricValue';

export default function PostgreSqlDashboard({ snapshot, timeConfig }) {
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');

  if (sensorConnectionStatus.startsWith('Agent Monitoring Issue') && agentMonitoringIssuesEnabled) {
    return null;
  }

  if (sensorConnectionStatus !== 'OK') {
    return <DashboardNotification type="info">{sensorConnectionStatus}</DashboardNotification>;
  }

  const isSlave = snapshot.getIn(['data', 'type'], 'Master') === 'Slave';
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
          renderPostChartContent={PluginDashboardsMarkerLanes}
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
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      {isSlave && (
        <DashboardSection title="Replication Delay">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: bytesZeroDecimalPlaces,
              metrics: ['replication_stats.replication_delay_bytes'],
              labels: ['In Bytes'],
              type: 'line'
            }}
            y2={{
              min: 0,
              formatter: seconds.fixedCompact,
              metrics: ['replication_stats.replication_delay_seconds'],
              labels: ['In Seconds'],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      )}
      <DatabasesTable snapshot={snapshot} timeConfig={timeConfig} />
      <DBmarlinNotification>
        <span style={{ marginRight: '5rem' }}>Looking for even deeper database insights?</span>
        <a href="https://www.dbmarlin.com/instana-offer?utm_campaign=Instana&utm_source=Instana&utm_medium=Instana">
          Check out our integration with DBmarlin!
        </a>
      </DBmarlinNotification>
    </div>
  );
}
