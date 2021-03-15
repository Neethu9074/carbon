/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import BrokersTable from 'in-forge/plugins/awsMskCluster/Dashboard/BrokersTable.js';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number, percentage } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function AwsMskClusterDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.awsMskCluster.dashboard.activeControllers')}>
          <MetricValue snapshotId={snapshotId} metric="active_controller_count" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.awsMskCluster.dashboard.topics')}>
          <MetricValue snapshotId={snapshotId} metric="global_topic_count" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.awsMskCluster.dashboard.activeControllers')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['active_controller_count'],
            labels: [t('in-forge:plugins.awsMskCluster.dashboard.count')],
            formatter: number.compact,
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.awsMskCluster.dashboard.topics')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['global_topic_count'],
            labels: [t('in-forge:plugins.awsMskCluster.dashboard.count')],
            formatter: number.compact,
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.awsMskCluster.dashboard.partitions')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['global_partition_count'],
            labels: [t('in-forge:plugins.awsMskCluster.dashboard.count')],
            formatter: number.compact,
            type: 'line'
          }}
          y2={{
            metrics: ['offline_partitions_count'],
            labels: [t('in-forge:plugins.awsMskCluster.dashboard.offline')],
            formatter: number.compact,
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.awsMskCluster.dashboard.dataLogs')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['kafka_data_logs_disk_used'],
            labels: [t('in-forge:plugins.awsMskCluster.dashboard.diskUsed')],
            formatter: percentage.compact,
            type: 'line'
          }}
        />
      </DashboardSection>

      <BrokersTable clusterSnapshotId={snapshot.get('id')} timeConfig={timeConfig} />
    </div>
  );
}
