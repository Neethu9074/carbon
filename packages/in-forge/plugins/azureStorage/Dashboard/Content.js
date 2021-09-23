/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number, bytes, millis } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default function AzureStorageDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  let hasQueue = false;
  const metricIds = snapshot.get('metricIds');
  hasQueue = metricIds.includes('qcap_av') && metricIds.includes('qms_av') && metricIds.includes('qc_av');

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
            formatter: bytes.compact,
            type: 'bar'
          }}
          y2={{
            metrics: ['in_av', 'in_mi', 'in_mx'],
            labels: [
              t('in-forge:plugins.azureStorage.dashboard.labelAverage'),
              t('in-forge:plugins.azureStorage.dashboard.labelMinimum'),
              t('in-forge:plugins.azureStorage.dashboard.labelMaximum')
            ],
            formatter: bytes.compact,
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
            formatter: bytes.compact,
            type: 'bar'
          }}
          y2={{
            metrics: ['eg_av', 'eg_mi', 'eg_mx'],
            labels: [
              t('in-forge:plugins.azureStorage.dashboard.labelAverage'),
              t('in-forge:plugins.azureStorage.dashboard.labelMinimum'),
              t('in-forge:plugins.azureStorage.dashboard.labelMaximum')
            ],
            formatter: bytes.compact,
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
            formatter: millis.compact,
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
            formatter: millis.compact,
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

      {hasQueue === true && (
        <div>
          <DashboardSection title={t('in-forge:plugins.azureStorage.dashboard.titleQueueCapacity')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                metrics: ['qcap_av'],
                labels: [t('in-forge:plugins.azureStorage.labelQuCa')],
                formatter: number.detailed,
                type: 'bar'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>

          <DashboardSection title={t('in-forge:plugins.azureStorage.dashboard.titleQueueCount')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                metrics: ['qc_av'],
                labels: [t('in-forge:plugins.azureStorage.labelQuCo')],
                formatter: number.detailed,
                type: 'bar'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>

          <DashboardSection title={t('in-forge:plugins.azureStorage.dashboard.titleQueueMessageCount')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                metrics: ['qms_av'],
                labels: [t('in-forge:plugins.azureStorage.labelQuMeCo')],
                formatter: number.detailed,
                type: 'bar'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        </div>
      )}
    </div>
  );
}
