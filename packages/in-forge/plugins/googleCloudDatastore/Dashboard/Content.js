/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { bytes, number } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function GcpDatastoreDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');

  if (sensorConnectionStatus !== 'OK') {
    return <DashboardNotification type="info">{sensorConnectionStatus}</DashboardNotification>;
  }

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.googleCloudDatastore.dashboard.requests')}>
          <MetricValue snapshotId={snapshotId} metric="request_count" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.googleCloudDatastore.dashboard.indexWrites')}>
          <MetricValue snapshotId={snapshotId} metric="index_write_count" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.googleCloudDatastore.dashboard.requests')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            tooltipFormatter: number.compact,
            metrics: [`request_count`],
            labels: [t('in-forge:plugins.googleCloudDatastore.dashboard.count')],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.googleCloudDatastore.dashboard.indexWrite')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            tooltipFormatter: number.compact,
            metrics: [`index_write_count`],
            labels: [t('in-forge:plugins.googleCloudDatastore.dashboard.count')],
            type: 'line'
          }}
        />
      </DashboardSection>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.googleCloudDatastore.dashboard.entityRead')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: bytes.detailed,
              tooltipFormatter: bytes.detailed,
              metrics: [`entity_read_sizes_avg`],
              labels: [t('in-forge:plugins.googleCloudDatastore.dashboard.avg')],
              type: 'line'
            }}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.googleCloudDatastore.dashboard.entityWrite')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: bytes.detailed,
              tooltipFormatter: bytes.detailed,
              metrics: [`entity_write_sizes_avg`],
              labels: [t('in-forge:plugins.googleCloudDatastore.dashboard.avg')],
              type: 'line'
            }}
          />
        </DashboardSection>
      </Columize>
    </div>
  );
}
