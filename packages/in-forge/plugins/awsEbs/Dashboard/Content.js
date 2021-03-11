/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import GetMetricStatisticsInUse from 'in-forge/plugins/awsDynamoDb/GetMetricStatisticsInUse';
import { bytes, number, percentage, seconds } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';

export default function AwsEbsDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <GetMetricStatisticsInUse snapshot={snapshot} />
      <DashboardSection title={t('in-forge:plugins.titleBytes')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['read_bytes', 'write_bytes'],
            labels: [t('in-forge:plugins.awsEbs.labelReadBytes'), t('in-forge:plugins.awsEbs.labelWriteBytes')],
            type: 'line',
            formatter: bytes.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.titleOperations')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['read_ops', 'write_ops'],
            labels: [
              t('in-forge:plugins.awsEbs.labelReadOperations'),
              t('in-forge:plugins.awsEbs.labelWriteOperations')
            ],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.titleTime')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['total_read_time', 'total_write_time'],
            labels: [t('in-forge:plugins.awsEbs.labelTotalReadTime'), t('in-forge:plugins.awsEbs.labelTotalWriteTime')],
            type: 'line',
            formatter: seconds.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.titleIdle')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['idle_time'],
            labels: [t('in-forge:plugins.awsEbs.labelIdleTime')],
            type: 'line',
            formatter: seconds.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.titleQueue')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['queue_length'],
            labels: [t('in-forge:plugins.awsEbs.labelQueueLength')],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      {snapshot.getIn(['data', 'type']) !== 'io1' && (
        <DashboardSection title={t('in-forge:plugins.titleBurst')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['burst_balance'],
              labels: [t('in-forge:plugins.awsEbs.burstBalance')],
              type: 'line',
              formatter: percentage.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      )}
    </div>
  );
}
