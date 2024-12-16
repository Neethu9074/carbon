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
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { yesOrNo } from 'in-services/formatters/boolean';
import { number } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function DeviceDashboard({ snapshot, timeConfig }: { snapshot: SnapshotData; timeConfig: TimeConfig }) {
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');
  if (sensorConnectionStatus !== 'OK') {
    return <DashboardNotification type="info">{sensorConnectionStatus}</DashboardNotification>;
  }
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.drbdDevice.deviceQuorum')}>
          <MetricValue snapshotId={snapshotId} metric="deviceQuorum" formatter={yesOrNo} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.drbdDevice.deviceUnintentionalDiskless')}>
          <MetricValue snapshotId={snapshotId} metric="deviceUnintentionalDiskless" formatter={yesOrNo} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.drbdDevice.deviceAlSuspended')}>
          <MetricValue snapshotId={snapshotId} metric="deviceAlSuspended" formatter={yesOrNo} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.drbdDevice.dashboard.deviceSizeBytes')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['deviceSizeBytes'],
            labels: [t('in-forge:plugins.drbdDevice.dashboard.deviceSizeBytes')],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.drbdDevice.dashboard.deviceBmWritesTotal')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['deviceBmWritesTotal'],
            labels: [t('in-forge:plugins.drbdDevice.dashboard.deviceBmWritesTotal')],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.drbdDevice.dashboard.DeviceIO')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            metrics: [`deviceReadBytesTotal`, `deviceWrittenBytesTotal`],
            labels: [
              t('in-forge:plugins.drbdDevice.dashboard.deviceReadBytesTotal'),
              t('in-forge:plugins.drbdDevice.dashboard.deviceWrittenBytesTotal')
            ],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.drbdDevice.dashboard.BlockIORequest')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            metrics: [`deviceUpperPending`, `deviceLowerPending`],
            labels: [
              t('in-forge:plugins.drbdDevice.dashboard.deviceUpperPending'),
              t('in-forge:plugins.drbdDevice.dashboard.deviceLowerPending')
            ],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.drbdDevice.dashboard.deviceAlWritesTotal')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            metrics: [`deviceAlWritesTotal`],
            labels: [t('in-forge:plugins.drbdDevice.dashboard.deviceAlWritesTotal')],
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}
