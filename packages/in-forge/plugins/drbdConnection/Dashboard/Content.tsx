/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { yesOrNo } from 'in-services/formatters/boolean';
import { number } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function ConnectionDashboard({
  snapshot,
  timeConfig
}: {
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}) {
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');
  if (sensorConnectionStatus !== 'OK') {
    return <DashboardNotification type="info">{sensorConnectionStatus}</DashboardNotification>;
  }
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.drbdConnection.dashboard.connectionRsInFlightBytes')}>
          <MetricValue snapshotId={snapshotId} metric="connectionRsInFlightBytes" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.drbdConnection.dashboard.connectionApInFlightBytes')}>
          <MetricValue snapshotId={snapshotId} metric="connectionApInFlightBytes" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.drbdConnection.dashboard.connectionCongested')}>
          <MetricValue snapshotId={snapshotId} metric="connectionCongested" formatter={yesOrNo} />
        </KpiKeyValue>
      </KpiSection>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.drbdConnection.dashboard.connectionRsInFlightBytes')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['connectionRsInFlightBytes'],
              labels: [t('in-forge:plugins.drbdConnection.dashboard.connectionRsInFlightBytes')],
              type: 'line',
              formatter: number.compact
            }}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.drbdConnection.dashboard.connectionApInFlightBytes')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['connectionApInFlightBytes'],
              labels: [t('in-forge:plugins.drbdConnection.dashboard.connectionApInFlightBytes')],
              type: 'line',
              formatter: number.compact
            }}
          />
        </DashboardSection>
      </Columize>
    </div>
  );
}
