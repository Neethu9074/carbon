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

export default function AwsMskClusterDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label="Active Controllers">
          <MetricValue snapshotId={snapshotId} metric="active_controller_count" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label="Topics">
          <MetricValue snapshotId={snapshotId} metric="global_topic_count" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title="Active Controllers">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['active_controller_count'],
            labels: ['Count'],
            formatter: number.compact,
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Topics">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['global_topic_count'],
            labels: ['Count'],
            formatter: number.compact,
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Partitions">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['global_partition_count'],
            labels: ['Count'],
            formatter: number.compact,
            type: 'line'
          }}
          y2={{
            metrics: ['offline_partitions_count'],
            labels: ['Offline'],
            formatter: number.compact,
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Data Logs">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['kafka_data_logs_disk_used'],
            labels: ['Disk Used'],
            formatter: percentage.compact,
            type: 'line'
          }}
        />
      </DashboardSection>

      <BrokersTable clusterSnapshotId={snapshot.get('id')} timeConfig={timeConfig} />
    </div>
  );
}
