/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number, bytes, millis } from 'in-services/formatters/number';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import QueuesDashboard from './QueuesDashboard';
import BlobsDashboard from './BlobsDashboard';
import { t } from 'in-i18n';

export default function AzureStorageDashboard({
  snapshot,
  timeConfig
}: {
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}) {
  const snapshotId = snapshot.get('id');
  let hasQueue = false;
  let hasBlobs = false;
  const metricIds = snapshot.get('metricIds');
  hasQueue = metricIds.includes('qcap_av') && metricIds.includes('qms_av') && metricIds.includes('qc_av');
  const blobCapabilities =
    snapshot.get('data').get('blobCapabilities') &&
    metricIds.includes('blobCapacity') &&
    metricIds.includes('blobCount') &&
    metricIds.includes('blobContainerCount');
  hasBlobs = blobCapabilities ? true : false;

  return (
    <div>
      <DashboardSection title={t('in-forge:plugins.azureStorage.dashboard.titleTransactions')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['tr_to'],
            labels: [t('in-forge:plugins.azureStorage.dashboard.labelTransactions')],
            formatter: number.detailed,
            type: 'bar'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureStorage.dashboard.titleIngress')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['in_to'],
            labels: [t('in-forge:plugins.azureStorage.dashboard.labelIngress')],
            formatter: bytes.detailed,
            type: 'bar'
          }}
          y2={{
            metrics: ['in_av', 'in_mi', 'in_mx'],
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

      <DashboardSection title={t('in-forge:plugins.azureStorage.dashboard.titleEgress')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['eg_to'],
            labels: [t('in-forge:plugins.azureStorage.dashboard.labelEgress')],
            formatter: bytes.detailed,
            type: 'bar'
          }}
          y2={{
            metrics: ['eg_av', 'eg_mi', 'eg_mx'],
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

      <DashboardSection title={t('in-forge:plugins.azureStorage.dashboard.titleServerLatency')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['sl_av', 'sl_mi', 'sl_mx'],
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

      <DashboardSection title={t('in-forge:plugins.azureStorage.dashboard.titleE2ELatency')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['el_av', 'el_mi', 'el_mx'],
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

      <DashboardSection title={t('in-forge:plugins.azureStorage.dashboard.titleAvailability')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['av_av', 'av_mi', 'av_mx'],
            labels: [
              t('in-forge:plugins.azureStorage.dashboard.labelAverage'),
              t('in-forge:plugins.azureStorage.dashboard.labelMinimum'),
              t('in-forge:plugins.azureStorage.dashboard.labelMaximum')
            ],
            formatter: number.detailed,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      {hasQueue === true && <QueuesDashboard snapshot={snapshot} timeConfig={timeConfig} />}

      {hasBlobs === true && <BlobsDashboard snapshot={snapshot} timeConfig={timeConfig} />}
    </div>
  );
}
