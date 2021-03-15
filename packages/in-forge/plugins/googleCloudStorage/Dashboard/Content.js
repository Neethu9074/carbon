/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { number, bytesZeroDecimalPlaces, bytesPerSecondTwoDecimalPlaces } from 'in-services/formatters/number';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function GoogleCloudStorageDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.googleCloudStorage.dashboard.requestsPerSecond')}>
          <MetricValue snapshotId={snapshotId} metric="api.request_count" formatter={number.detailed} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.googleCloudStorage.dashboard.objectsCount')}>
          <MetricValue snapshotId={snapshotId} metric="storage.object_count" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.googleCloudStorage.dashboard.objectsSize')}>
          <MetricValue snapshotId={snapshotId} metric="storage.total_bytes" formatter={bytesZeroDecimalPlaces} />
        </KpiKeyValue>
      </KpiSection>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.googleCloudStorage.dashboard.requests')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['api.request_count'],
              labels: [t('in-forge:plugins.googleCloudStorage.dashboard.totalCount')],
              type: 'line',
              formatter: number.detailed
            }}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.googleCloudStorage.dashboard.objectRequests')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['api.request_count2.ReadObject', 'api.request_count2.WriteObject'],
              labels: [
                t('in-forge:plugins.googleCloudStorage.dashboard.read'),
                t('in-forge:plugins.googleCloudStorage.dashboard.write')
              ],
              type: 'line',
              formatter: number.detailed
            }}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.googleCloudStorage.dashboard.objects')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['storage.object_count'],
              labels: [t('in-forge:plugins.googleCloudStorage.dashboard.count')],
              type: 'line',
              formatter: number.compact
            }}
            y2={{
              min: 0,
              metrics: ['storage.total_bytes'],
              labels: [t('in-forge:plugins.googleCloudStorage.dashboard.size')],
              type: 'line',
              formatter: bytesZeroDecimalPlaces
            }}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.googleCloudStorage.dashboard.network')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['network.sent_bytes_count', 'network.received_bytes_count'],
              labels: [
                t('in-forge:plugins.googleCloudStorage.dashboard.sent'),
                t('in-forge:plugins.googleCloudStorage.dashboard.received')
              ],
              type: 'line',
              formatter: bytesPerSecondTwoDecimalPlaces
            }}
          />
        </DashboardSection>
      </Columize>
    </div>
  );
}
