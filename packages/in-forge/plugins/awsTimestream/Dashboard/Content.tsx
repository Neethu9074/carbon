/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiKeyValue, KpiSection } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { zeroDecimalPlaces, millis } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function AwsTimestreamDashboard({
  snapshot,
  timeConfig
}: {
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}) {
  const snapshotId = snapshot.get('id');

  return (
    <>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.awsTimestream.labelSuccessfulRequestLatencyAvg')}>
          <MetricValue snapshotId={snapshotId} metric="successful_request_latency_avg" formatter={millis.compact} />
        </KpiKeyValue>

        <KpiKeyValue label={t('in-forge:plugins.awsTimestream.labelSuccessfulRequestLatencySampleCount')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="successful_request_latency_sample_count"
            formatter={zeroDecimalPlaces}
          />
        </KpiKeyValue>
      </KpiSection>

      {/* Successful request latency */}
      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsTimestream.dashboard.titleSuccessfulRequestLatency')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: millis.detailed,
              metrics: [
                'successful_request_latency_min',
                'successful_request_latency_max',
                'successful_request_latency_avg'
              ],
              labels: [
                t('in-forge:plugins.awsTimestream.dashboard.labelMin'),
                t('in-forge:plugins.awsTimestream.dashboard.labelMax'),
                t('in-forge:plugins.awsTimestream.dashboard.labelAvg')
              ],
              type: 'line',
              min: 0
            }}
            y2={{
              formatter: zeroDecimalPlaces,
              metrics: ['successful_request_latency_sample_count'],
              labels: [t('in-forge:plugins.awsTimestream.dashboard.labelSampleCount')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      {/* Writing and storage */}
      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsTimestream.dashboard.titleMagneticStoreRejectedRecord')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['magnetic_store_rejected_record_count'],
              labels: [t('in-forge:plugins.awsTimestream.dashboard.labelCount')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.awsTimestream.dashboard.titleActiveMagneticStorePartitions')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['active_magnetic_store_partitions'],
              labels: [t('in-forge:plugins.awsTimestream.dashboard.labelCount')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.awsTimestream.dashboard.titleMagneticStoreRecordPendingLatency')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: millis.detailed,
              metrics: ['magnetic_store_pending_records_latency'],
              labels: [t('in-forge:plugins.awsTimestream.dashboard.labelTime')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      {/* Magnetic Store Rejected Upload Failure */}
      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsTimestream.dashboard.titleMagneticStoreRejectedUploadFailure')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: [
                'magnetic_store_rejected_upload_user_failures',
                'magnetic_store_rejected_upload_system_failures'
              ],
              labels: [
                t('in-forge:plugins.awsTimestream.dashboard.labelUser'),
                t('in-forge:plugins.awsTimestream.dashboard.labelSystem')
              ],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
    </>
  );
}
