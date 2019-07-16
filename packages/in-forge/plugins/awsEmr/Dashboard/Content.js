import React from 'react';

import GetMetricStatisticsInUse from 'in-forge/plugins/awsDynamoDb/GetMetricStatisticsInUse';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import {
  bytesTwoDecimalPlaces,
  bytesZeroDecimalPlaces,
  percentage,
  zeroDecimalPlaces
} from 'in-services/formatters/number';

export default function AwsEmrDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <GetMetricStatisticsInUse snapshot={snapshot} />
      <DashboardSection title="Cluster Nodes">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['active_nodes', 'decommissioned_nodes', 'unhealthy_nodes', 'lost_nodes'],
            labels: ['Active Nodes', 'Decommissioned Nodes', 'Unhealthy Nodes', 'Lost Nodes'],
            type: 'stackedArea',
            formatter: zeroDecimalPlaces
          }}
        />
      </DashboardSection>
      <Columize>
        <DashboardSection title="Applications Status">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['apps_running', 'apps_pending', 'apps_failed'],
              labels: ['Apps Running', 'Apps Pending', 'Apps Failed'],
              type: 'stackedArea',
              formatter: zeroDecimalPlaces
            }}
          />
        </DashboardSection>
        <DashboardSection title="Memory Statistics">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['memory_allocated_megabytes', 'memory_reserved_megabytes', 'memory_available_megabytes'],
              labels: ['Memory Allocated', 'Memory Reserved', 'Memory Available'],
              type: 'stackedArea',
              formatter: bytesZeroDecimalPlaces,
              tooltipFormatter: bytesTwoDecimalPlaces
            }}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title="S3 Bucket I/O">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['s3_bytes_written', 's3_bytes_read'],
              labels: ['Written', 'Read'],
              type: 'stackedArea',
              formatter: bytesZeroDecimalPlaces,
              tooltipFormatter: bytesTwoDecimalPlaces
            }}
          />
        </DashboardSection>
        <DashboardSection title="Containers Allocated">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['container_allocated'],
              labels: ['Containers Allocated'],
              type: 'stackedArea',
              formatter: zeroDecimalPlaces
            }}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title="HDFS Utilization">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['hdfs_utilization'],
              labels: ['HDFS Utilization'],
              type: 'stackedArea',
              formatter: percentage.compact
            }}
          />
        </DashboardSection>
        <DashboardSection title="Total Concurrent Data Transfers">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['total_load'],
              labels: ['Total Load'],
              type: 'stackedArea',
              formatter: zeroDecimalPlaces
            }}
          />
        </DashboardSection>
      </Columize>
    </div>
  );
}
