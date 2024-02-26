/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import { number } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function ConnectionDashboard({ snapshot, timeConfig }) {
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');
  if (sensorConnectionStatus !== 'OK') {
    return <DashboardNotification type="info">{sensorConnectionStatus}</DashboardNotification>;
  }
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.drbdConnection.dashboard.connectionRsinflightBytes')}>
          <MetricValue snapshotId={snapshotId} metric="connectionRsinflightBytes" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.drbdConnection.connectionApinflightBytes')}>
          <MetricValue snapshotId={snapshotId} metric="connectionApinflightBytes" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.drbdConnection.dashboard.connectionRsinflightBytes')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['connectionRsinflightBytes'],
              labels: [t('in-forge:plugins.drbdConnection.dashboard.connectionRsinflightBytes')],
              type: 'line',
              formatter: number.compact
            }}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.drbdConnection.dashboard.connectionApinflightBytes')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['connectionApinflightBytes'],
              labels: [t('in-forge:plugins.drbdConnection.dashboard.connectionApinflightBytes')],
              type: 'line',
              formatter: number.compact
            }}
          />
        </DashboardSection>
      </Columize>
    </div>
  );
}
