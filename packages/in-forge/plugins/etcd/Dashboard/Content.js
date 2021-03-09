/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { zeroDecimalPlaces, bytesZeroDecimalPlaces } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import OperationsTable from 'in-forge/plugins/etcd/Dashboard/OperationsTable';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import Columize from 'in-sdk/components/dashboard/Columize';
import { t } from 'in-i18n';

export default function EtcdDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');
  if (sensorConnectionStatus !== 'OK') {
    return <DashboardNotification type="info">{sensorConnectionStatus}</DashboardNotification>;
  }
  return (
    <div>
      <DashboardSection title={t('in-forge:plugins.etcd.dashboard.requests')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['requests_received', 'requests_sent'],
            labels: [t('in-forge:plugins.etcd.dashboard.received'), t('in-forge:plugins.etcd.dashboard.sent')],
            formatter: zeroDecimalPlaces,
            type: 'stackedBar',
            aggregation: 'sum'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.etcd.dashboard.traffic')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['bytes_per_sec_received', 'bytes_per_sec_sent'],
            labels: [t('in-forge:plugins.etcd.dashboard.received'), t('in-forge:plugins.etcd.dashboard.sent')],
            formatter: bytesZeroDecimalPlaces,
            type: 'stackedBar',
            aggregation: 'sum'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.etcd.dashboard.storage')}>
        <Columize>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['storage.expire_count'],
              labels: [t('in-forge:plugins.etcd.dashboard.expireCount')],
              formatter: zeroDecimalPlaces,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['storage.watchers'],
              labels: [t('in-forge:plugins.etcd.dashboard.watchers')],
              formatter: zeroDecimalPlaces,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </Columize>
      </DashboardSection>
      <OperationsTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
