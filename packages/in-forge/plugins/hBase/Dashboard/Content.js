/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import {
  zeroDecimalPlaces,
  twoDecimalPlaces,
  msZeroDecimalPlaces,
  bytesTwoDecimalPlaces,
  percentageTwoDecimalPlaces
} from 'in-services/formatters/number';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import MetricValue from 'in-components/MetricValue';

export default function HBaseDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label="Cluster Requests">
          <MetricValue snapshotId={snapshotId} metric="master_cluster_requests" formatter={zeroDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label="Average Load">
          <MetricValue snapshotId={snapshotId} metric="avg_load" formatter={zeroDecimalPlaces} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title="Master Server">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['master_cluster_requests'],
            labels: ['Cluster Requests'],
            min: 0,
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Statistics">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['stats_active_sinks', 'stats_active_sources'],
            labels: ['Active sinks', 'Active sources'],
            min: 0,
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Publish">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['stats_pub_ops'],
            labels: ['Publish operations'],
            min: 0,
            type: 'line',
            formatter: twoDecimalPlaces
          }}
          y2={{
            metrics: ['stats_pub_avg_time'],
            labels: ['Publish Average Time'],
            min: 0,
            type: 'line',
            formatter: msZeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Snapshot">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['stats_snap_ops'],
            labels: ['Snapshot operations'],
            min: 0,
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
          y2={{
            metrics: ['stats_snap_avg_time'],
            labels: ['Snapshot Average Time'],
            min: 0,
            type: 'line',
            formatter: msZeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Region Server - Split">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['rs_split_request_count', 'rs_split_success_count'],
            labels: ['Split requests', 'Split success'],
            min: 0,
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <Columize>
        <DashboardSection title="Region Server - Compaction">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['rs_comp_queue_length'],
              labels: ['Compaction Queue Length'],
              min: 0,
              type: 'line',
              formatter: zeroDecimalPlaces
            }}
            y2={{
              metrics: ['rs_comp_cells_count', 'rs_comp_cells_size'],
              labels: ['Compaction Cell Count', 'Compaction Cell Size'],
              min: 0,
              type: 'line',
              formatter: zeroDecimalPlaces
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title="Region Server - Flush">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['rs_flush_queue_length'],
              labels: ['Flush Queue Length'],
              min: 0,
              type: 'line',
              formatter: zeroDecimalPlaces
            }}
            y2={{
              metrics: ['rs_flush_cells_count', 'rs_flush_cells_size'],
              labels: ['Flush Cell Count', 'Flush Cell Size'],
              min: 0,
              type: 'line',
              formatter: zeroDecimalPlaces
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title="Region Server - Store File">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['rs_store_file_count'],
              labels: ['Store File Count'],
              min: 0,
              type: 'line',
              formatter: zeroDecimalPlaces
            }}
            y2={{
              metrics: ['rs_store_file_index_size', 'rs_store_file_size'],
              labels: ['Store File Index Size', 'Store File Size'],
              min: 0,
              type: 'line',
              formatter: bytesTwoDecimalPlaces
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title="Region Server - Block cache">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['rs_blk_cache_hit_count', 'rs_blk_cache_miss_count'],
              labels: ['Block Cache Hit', 'Block Cache Miss'],
              min: 0,
              type: 'line',
              formatter: zeroDecimalPlaces
            }}
            y2={{
              metrics: ['rs_blk_cache_hit_rate'],
              labels: ['Block cache hit rate'],
              min: 0,
              type: 'line',
              formatter: percentageTwoDecimalPlaces
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
    </div>
  );
}
