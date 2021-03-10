/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import {
  activityZeroDecimalPlaces,
  zeroDecimalPlaces,
  percentageTwoDecimalPlaces,
  bytesZeroDecimalPlaces,
  seconds
} from 'in-services/formatters/number';
import DBmarlinNotificationMessage from 'in-forge/plugins/awsRds/Dashboard/DBmarlinNotificationMessage';
import DatabasesTable from 'in-forge/plugins/postgreSqlDatabase/Dashboard/DatabasesTable';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { agentMonitoringIssuesEnabled } from 'in-services/featureFlags';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

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
        <KpiKeyValue label={t('in-forge:plugins.postgreSqlDatabase.dashboard.committedTransactionsKpiLabel')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="totalCommittedTransactions"
            formatter={activityZeroDecimalPlaces}
          />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.postgreSqlDatabase.dashboard.totalConnections')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['total_active_connections'],
            labels: [t('in-forge:plugins.postgreSqlDatabase.dashboard.active')],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.postgreSqlDatabase.dashboard.connectionUsage')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            max: 1,
            formatter: percentageTwoDecimalPlaces,
            metrics: ['max_conn_pct'],
            labels: [t('in-forge:plugins.postgreSqlDatabase.dashboard.usage')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      {isSlave && (
        <DashboardSection title={t('in-forge:plugins.postgreSqlDatabase.dashboard.replicationDelay')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: bytesZeroDecimalPlaces,
              metrics: ['replication_stats.replication_delay_bytes'],
              labels: [t('in-forge:plugins.postgreSqlDatabase.dashboard.inBytes')],
              type: 'line'
            }}
            y2={{
              min: 0,
              formatter: seconds.fixedCompact,
              metrics: ['replication_stats.replication_delay_seconds'],
              labels: [t('in-forge:plugins.postgreSqlDatabase.dashboard.inSeconds')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      )}
      <DatabasesTable snapshot={snapshot} timeConfig={timeConfig} />
      <DBmarlinNotificationMessage />
    </div>
  );
}
