/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import ResourcesTable from 'in-forge/plugins/drbd/Dashboard/ResourcesTable';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number, twoDecimalPlaces } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function DrbdDashboard({ snapshot, timeConfig }) {
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');
  if (sensorConnectionStatus !== 'OK') {
    return <DashboardNotification type="info">{sensorConnectionStatus}</DashboardNotification>;
  }
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.drbd.resourcesNumber')}>
          <MetricValue snapshotId={snapshotId} metric="resourcesNumber" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.drbd.resourceSuspendedCount')}>
          <MetricValue snapshotId={snapshotId} metric="resourceSuspendedCount" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
      <ResourcesTable snapshot={snapshot} timeConfig={timeConfig} snapshotId={snapshotId} />
      <Columize>
        <DashboardSection title={t('in-forge:plugins.drbd.resourcesNumber')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['resourcesNumber'],
              labels: [t('in-forge:plugins.drbd.resourcesNumber')],
              type: 'line',
              formatter: number.compact
            }}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.drbd.resourceSuspendedCount')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['resourceSuspendedCount'],
              labels: [t('in-forge:plugins.drbd.resourceSuspendedCount')],
              type: 'line',
              formatter: twoDecimalPlaces
            }}
          />
        </DashboardSection>
      </Columize>
      <ResourcesTable snapshot={snapshot} timeConfig={timeConfig} snapshotId={snapshotId} />
    </div>
  );
}
