/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import RemoteServiceAgentCorrelationComponent from 'in-sdk/components/sidebar/remoteServiceAgentCorrelation/remoteServiceAgentCorrelationComponent';
import GetMetricStatisticsInUse from 'in-forge/plugins/awsDynamoDb/GetMetricStatisticsInUse';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number, bytes, millis } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default function AwsS3Dashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <GetMetricStatisticsInUse snapshot={snapshot} />
      <DashboardSection title={t('in-forge:plugins.awsS3.dashboard.requests')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: [
              'all_requests',
              'get_requests',
              'put_requests',
              'delete_requests',
              'head_requests',
              'post_requests',
              'list_requests'
            ],
            labels: [
              t('in-forge:plugins.awsS3.dashboard.all'),
              t('in-forge:plugins.awsS3.dashboard.get'),
              t('in-forge:plugins.awsS3.dashboard.put'),
              t('in-forge:plugins.awsS3.dashboard.delete'),
              t('in-forge:plugins.awsS3.dashboard.head'),
              t('in-forge:plugins.awsS3.dashboard.post'),
              t('in-forge:plugins.awsS3.dashboard.list')
            ],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.awsS3.dashboard.traffic')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['bytes_downloaded', 'bytes_uploaded'],
            labels: [t('in-forge:plugins.awsS3.dashboard.downloaded'), t('in-forge:plugins.awsS3.dashboard.uploaded')],
            type: 'line',
            formatter: bytes.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.awsS3.dashboard.errors')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['4xx_errors', '5xx_errors'],
            labels: ['4xx Errors', '5xx Errors'],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.awsS3.dashboard.latency')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['first_byte_latency', 'total_request_latency'],
            labels: [
              t('in-forge:plugins.awsS3.dashboard.firstByteLatency'),
              t('in-forge:plugins.awsS3.dashboard.totalRequestLatency')
            ],
            type: 'line',
            formatter: millis.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <RemoteServiceAgentCorrelationComponent snapshot={snapshot} />
    </div>
  );
}
