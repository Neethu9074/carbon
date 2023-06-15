/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { number, millis, bytes, percentagePlainTwoDecimalPlaces } from 'in-services/formatters/number';
import GetMetricStatisticsInUse from 'in-forge/plugins/awsDynamoDb/GetMetricStatisticsInUse';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import FunctionsTable from './FunctionsTable';
import { t } from 'in-i18n';

export default function AwsCloudFrontDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <GetMetricStatisticsInUse snapshot={snapshot} />

      {/* Distribution metric charts */}
      <DashboardSection title={t('in-forge:plugins.awsCloudFront.titleRequests')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['requests'],
            labels: [t('in-forge:plugins.awsCloudFront.labelRequests')],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.awsCloudFront.titleData')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['bytes_uploaded', 'bytes_downloaded'],
            labels: [
              t('in-forge:plugins.awsCloudFront.labelBytesUploaded'),
              t('in-forge:plugins.awsCloudFront.labelBytesDownloaded')
            ],
            type: 'line',
            formatter: bytes.detailed
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.awsCloudFront.titleErrorRate')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['4xx_error_rate', '5xx_error_rate', 'total_error_rate'],
            labels: [
              t('in-forge:plugins.awsCloudFront.label4xxErrorRate'),
              t('in-forge:plugins.awsCloudFront.label5xxErrorRate'),
              t('in-forge:plugins.awsCloudFront.labelTotalErrorRate')
            ],
            type: 'line',
            formatter: percentagePlainTwoDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.awsCloudFront.titleCacheHit')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['cache_hit_rate'],
            labels: [t('in-forge:plugins.awsCloudFront.labelCacheHitRate')],
            type: 'line',
            min: 0,
            formatter: percentagePlainTwoDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.awsCloudFront.titleOriginLatency')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['origin_latency'],
            labels: [t('in-forge:plugins.awsCloudFront.labelOriginLatency')],
            type: 'line',
            formatter: millis.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <FunctionsTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
