/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import GetMetricStatisticsInUse from 'in-forge/plugins/awsDynamoDb/GetMetricStatisticsInUse';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { bytes, number, percentage } from 'in-services/formatters/number';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import { t } from 'in-i18n';

export default function AwsEmrDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <GetMetricStatisticsInUse snapshot={snapshot} />
      <DashboardSection title={t('in-forge:plugins.awsEmr.titleClusterNodes')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['active_nodes', 'decommissioned_nodes', 'unhealthy_nodes', 'lost_nodes'],
            labels: [
              t('in-forge:plugins.awsEmr.labelActive'),
              t('in-forge:plugins.awsEmr.labelDecommissioned'),
              t('in-forge:plugins.awsEmr.labelUnhealthy'),
              t('in-forge:plugins.awsEmr.labelLost')
            ],
            type: 'stackedArea',
            formatter: number.compact,
            tooltipFormatter: number.detailed
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsEmr.titleApplicationsStatus')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['apps_running', 'apps_pending', 'apps_failed'],
              labels: [
                t('in-forge:plugins.awsEmr.labelRunning'),
                t('in-forge:plugins.awsEmr.labelPending'),
                t('in-forge:plugins.awsEmr.labelFailed')
              ],
              type: 'stackedArea',
              formatter: number.compact,
              tooltipFormatter: number.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.awsEmr.titleMemoryStatistics')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['memory_allocated_megabytes', 'memory_reserved_megabytes', 'memory_available_megabytes'],
              labels: [
                t('in-forge:plugins.awsEmr.labelAllocated'),
                t('in-forge:plugins.awsEmr.labelReserved'),
                t('in-forge:plugins.awsEmr.labelAvailable')
              ],
              type: 'stackedArea',
              formatter: bytes.detailed,
              tooltipFormatter: bytes.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsEmr.titleS3BucketIO')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['s3_bytes_written', 's3_bytes_read'],
              labels: [t('in-forge:plugins.awsEmr.labelWritten'), t('in-forge:plugins.awsEmr.labelWritten')],
              type: 'stackedArea',
              formatter: bytes.detailed,
              tooltipFormatter: bytes.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.awsEmr.titleContainersAllocated')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['container_allocated'],
              labels: [t('in-forge:plugins.awsEmr.labelContainersAllocated')],
              type: 'stackedArea',
              formatter: number.compact,
              tooltipFormatter: number.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsEmr.titleHDFSUtilization')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['HDFS_utilization'],
              labels: [t('in-forge:plugins.awsEmr.labelHDFSUtilization')],
              type: 'stackedArea',
              formatter: percentage
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.awsEmr.titleTotalConcurrentDataTransfers')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['total_load'],
              labels: [t('in-forge:plugins.awsEmr.labelTotalLoad')],
              type: 'stackedArea',
              formatter: number.compact,
              tooltipFormatter: number.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
    </div>
  );
}
