/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import ConnectionsTable from 'in-forge/plugins/drbdResource/Dashboard/ConnectionsTable';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DevicesTable from 'in-forge/plugins/drbdResource/Dashboard/DevicesTable';
import PeersTable from 'in-forge/plugins/drbdResource/Dashboard/PeersTable';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import { number } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function ResourceDashboard({ snapshot, timeConfig }) {
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');
  if (sensorConnectionStatus !== 'OK') {
    return <DashboardNotification type="info">{sensorConnectionStatus}</DashboardNotification>;
  }
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.drbdResource.resourceSuspended')}>
          <MetricValue snapshotId={snapshotId} metric="resourceSuspended" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.drbdResource.resourceMaypromote')}>
          <MetricValue snapshotId={snapshotId} metric="resourceMaypromote" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.drbdResource.resourceForceiofailures')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['ts_avgResTime'],
              labels: [t('in-forge:plugins.drbdResource.resourceForceiofailures')],
              type: 'line',
              formatter: number.compact
            }}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.drbdResource.resourcePromotionscore')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['ts_throughput'],
              labels: [t('in-forge:plugins.drbdResource.resourcePromotionscore')],
              type: 'line',
              formatter: number.compact
            }}
          />
        </DashboardSection>
      </Columize>
      <DevicesTable snapshot={snapshot} timeConfig={timeConfig} snapshotId={snapshotId} />
      <ConnectionsTable snapshot={snapshot} timeConfig={timeConfig} snapshotId={snapshotId} />
      <PeersTable snapshot={snapshot} timeConfig={timeConfig} snapshotId={snapshotId} />
    </div>
  );
}
