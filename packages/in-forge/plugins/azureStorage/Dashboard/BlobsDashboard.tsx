/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import BlobsTable from 'in-forge/plugins/azureStorage/Dashboard/BlobsTable';
import { number, bytes, millis } from 'in-services/formatters/number';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

export default function BlobDashboard({ snapshot, timeConfig }: { snapshot: SnapshotData; timeConfig: TimeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <DashboardSection title={t('in-forge:plugins.azureStorage.dashboard.titleBlobCapacity')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['blobCapacity'],
            labels: [t('in-forge:plugins.azureStorage.dashboard.labelAverage')],
            formatter: bytes.detailed,
            type: 'bar'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureStorage.dashboard.titleBlobCount')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['blobCount'],
            labels: [t('in-forge:plugins.azureStorage.dashboard.labelAverage')],
            formatter: number.compact,
            type: 'bar'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureStorage.dashboard.titleBlobContainerCount')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['blobContainerCount'],
            labels: [t('in-forge:plugins.azureStorage.dashboard.labelAverage')],
            formatter: number.compact,
            type: 'bar'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.azureStorage.dashboard.titleBlobIngress')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['blobIngressTotal'],
            labels: [t('in-forge:plugins.azureStorage.dashboard.labelIngress')],
            formatter: bytes.detailed,
            type: 'bar'
          }}
          y2={{
            metrics: ['blobIngressAverage', 'blobIngressMin', 'blobIngressMax'],
            labels: [
              t('in-forge:plugins.azureStorage.dashboard.labelAverage'),
              t('in-forge:plugins.azureStorage.dashboard.labelMinimum'),
              t('in-forge:plugins.azureStorage.dashboard.labelMaximum')
            ],
            formatter: bytes.detailed,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureStorage.dashboard.titleBlobEgress')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['blobEgressTotal'],
            labels: [t('in-forge:plugins.azureStorage.dashboard.labelEgress')],
            formatter: bytes.detailed,
            type: 'bar'
          }}
          y2={{
            metrics: ['blobEgressAverage', 'blobEgressMin', 'blobEgressMax'],
            labels: [
              t('in-forge:plugins.azureStorage.dashboard.labelAverage'),
              t('in-forge:plugins.azureStorage.dashboard.labelMinimum'),
              t('in-forge:plugins.azureStorage.dashboard.labelMaximum')
            ],
            formatter: bytes.detailed,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureStorage.dashboard.titleBlobServerLatency')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['blobSuccessServerLatencyAverage', 'blobSuccessServerLatencyMin', 'blobSuccessServerLatencyMax'],
            labels: [
              t('in-forge:plugins.azureStorage.dashboard.labelAverage'),
              t('in-forge:plugins.azureStorage.dashboard.labelMinimum'),
              t('in-forge:plugins.azureStorage.dashboard.labelMaximum')
            ],
            formatter: millis.detailed,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureStorage.dashboard.titleBlobE2ELatency')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['blobSuccessE2ELatencyAverage', 'blobSuccessE2ELatencyMin', 'blobSuccessE2ELatencyMax'],
            labels: [
              t('in-forge:plugins.azureStorage.dashboard.labelAverage'),
              t('in-forge:plugins.azureStorage.dashboard.labelMinimum'),
              t('in-forge:plugins.azureStorage.dashboard.labelMaximum')
            ],
            formatter: millis.detailed,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <BlobsTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
