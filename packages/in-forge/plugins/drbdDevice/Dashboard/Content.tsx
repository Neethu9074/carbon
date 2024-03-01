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
import { number } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';
import { TimeConfig } from '@instana/types';
import { SnapshotData } from 'in-stores/snapshot/snapshot';

export default function DeviceDashboard({ snapshot, timeConfig }: { snapshot: SnapshotData; timeConfig: TimeConfig; }) {
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');
  if (sensorConnectionStatus !== 'OK') {
    return <DashboardNotification type="info">{sensorConnectionStatus}</DashboardNotification>;
  }
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.drbdDevice.drbdDeviceQuorum')}>
          <MetricValue snapshotId={snapshotId} metric="drbdDeviceQuorum" formatter={Boolean} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.drbdDevice.drbdDeviceUnintentionaldiskless')}>
          <MetricValue snapshotId={snapshotId} metric="drbdDeviceUnintentionaldiskless" formatter={Boolean} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.drbdDevice.dashboard.drbdDeviceSizeBytes')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['drbdDeviceSizeBytes'],
            labels: [t('in-forge:plugins.drbdDevice.dashboard.drbdDeviceSizeBytes')],
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
            tooltipFormatter: number.compact,
            metrics: [`drbdDeviceReadBytesTotal`, `drbdDeviceWrittenBytesTotal`],
            labels: [
              t('in-forge:plugins.drbdDevice.dashboard.drbdDeviceReadBytesTotal'),
              t('in-forge:plugins.drbdDevice.dashboard.drbdDeviceWrittenBytesTotal')
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
            tooltipFormatter: number.compact,
            metrics: [`drbdDeviceUpperpending`, `drbdDeviceLowerpending`],
            labels: [
              t('in-forge:plugins.drbdDevice.dashboard.drbdDeviceUpperpending'),
              t('in-forge:plugins.drbdDevice.dashboard.drbdDeviceLowerpending')
            ],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.drbdDevice.dashboard.NumberOfUpdates')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            tooltipFormatter: number.compact,
            metrics: [`drbdDeviceAlsuspended`, `drbdDeviceAlwritesTotal`],
            labels: [
              t('in-forge:plugins.drbdDevice.dashboard.drbdDeviceAlsuspended'),
              t('in-forge:plugins.drbdDevice.dashboard.drbdDeviceAlwritesTotal')
            ],
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}
