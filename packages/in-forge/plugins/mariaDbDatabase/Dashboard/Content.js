/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import DBmarlinNotificationMessage from 'in-forge/plugins/awsRds/Dashboard/DBmarlinNotificationMessage';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function MariaDbDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');
  if (sensorConnectionStatus !== 'OK') {
    return <DashboardNotification type="info">{sensorConnectionStatus}</DashboardNotification>;
  }
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.mariaDbDatabase.queries')}>
          <MetricValue snapshotId={snapshotId} metric="status.QUERIES" />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.mariaDbDatabase.clientConnections')}>
          <MetricValue snapshotId={snapshotId} metric="status.THREADS_CONNECTED" />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title={t('in-forge:plugins.mariaDbDatabase.clients')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['status.THREADS_CONNECTED', 'status.MAX_USED_CONNECTIONS', 'status.ABORTED_CONNECTS'],
            labels: [
              t('in-forge:plugins.mariaDbDatabase.connections'),
              t('in-forge:plugins.mariaDbDatabase.maxUsedConnections'),
              t('in-forge:plugins.mariaDbDatabase.abortedConnects')
            ],
            type: 'line',
            formatter: number.detailed
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.mariaDbDatabase.slowQueries')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['status.SLOW_QUERIES'],
            labels: [t('in-forge:plugins.mariaDbDatabase.slowQueries')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.mariaDbDatabase.keyAccess')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['status.KEY_READ_REQUESTS', 'status.KEY_WRITE_REQUESTS'],
            labels: [
              t('in-forge:plugins.mariaDbDatabase.readRequests'),
              t('in-forge:plugins.mariaDbDatabase.writeRequests')
            ],
            type: 'line'
          }}
          y2={{
            metrics: ['status.KEY_READS', 'status.KEY_WRITES'],
            labels: [t('in-forge:plugins.mariaDbDatabase.reads'), t('in-forge:plugins.mariaDbDatabase.writes')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.mariaDbDatabase.ariaEngineProperties')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['status.ARIA_PAGECACHE_READS', 'status.ARIA_PAGECACHE_WRITES'],
            labels: [
              t('in-forge:plugins.mariaDbDatabase.pagecacheReads'),
              t('in-forge:plugins.mariaDbDatabase.pagecacheWrites')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DBmarlinNotificationMessage />
    </div>
  );
}
