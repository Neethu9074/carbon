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
            labels: ['Active', 'Decommissioned', 'Unhealthy', 'Lost'],
            type: 'stackedArea',
            formatter: number.compact,
            tooltipFormatter: number.detailed
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
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
              labels: ['Running', 'Pending', 'Failed'],
              type: 'stackedArea',
              formatter: number.compact,
              tooltipFormatter: number.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title="Memory Statistics">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['memory_allocated_megabytes', 'memory_reserved_megabytes', 'memory_available_megabytes'],
              labels: ['Allocated', 'Reserved', 'Available'],
              type: 'stackedArea',
              formatter: bytes.detailed,
              tooltipFormatter: bytes.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
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
              formatter: bytes.detailed,
              tooltipFormatter: bytes.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
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
              formatter: number.compact,
              tooltipFormatter: number.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
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
              metrics: ['HDFS_utilization'],
              labels: ['HDFS Utilization'],
              type: 'stackedArea',
              formatter: percentage
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
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
