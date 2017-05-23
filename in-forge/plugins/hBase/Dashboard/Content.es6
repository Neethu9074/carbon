import React from 'react';

import { zeroDecimalPlaces, msZeroDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';

import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import TwoColumnRow from 'in-sdk/components/dashboard/TwoColumnRow';
import MetricValue from 'in-components/MetricValue';
import { getLabel } from 'in-sdk/snapshot';

const percentage = d => d + '%';

export default function HBaseDashboard({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiHeading>
          {getLabel(snapshot)}
        </KpiHeading>
        <KpiKeyValue label="Cluster Requests">
          <MetricValue snapshotId={snapshotId} metric="master_cluster_requests" formatter={zeroDecimalPlaces} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title="Master Server">
        <ChartWithLegend
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 40,
            right: 40
          }}
          y1={{
            metrics: ['master_cluster_requests'],
            labels: ['Cluster Requests'],
            min: 0,
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
        />
      </DashboardSection>
      <DashboardSection title="Statistics">
        <ChartWithLegend
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 40,
            right: 40
          }}
          y1={{
            metrics: ['stats_active_sinks', 'stats_active_sources'],
            labels: ['Active sinks', 'Active sources'],
            min: 0,
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
        />
      </DashboardSection>
      <DashboardSection title="Publish">
        <ChartWithLegend
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 40,
            right: 40
          }}
          y1={{
            metrics: ['stats_pub_ops'],
            labels: ['Publish operations'],
            min: 0,
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
          y2={{
            metrics: ['stats_pub_avg_time'],
            labels: ['Publish Average Time'],
            min: 0,
            type: 'line',
            formatter: msZeroDecimalPlaces
          }}
        />
      </DashboardSection>
      <DashboardSection title="Snapshot">
        <ChartWithLegend
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 40,
            right: 40
          }}
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
        />
      </DashboardSection>
      <DashboardSection title="Region Server - Split">
        <ChartWithLegend
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 40,
            right: 40
          }}
          y1={{
            metrics: ['rs_split_request_count', 'rs_split_success_count'],
            labels: ['Split requests', 'Split success'],
            min: 0,
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
        />
      </DashboardSection>
      <TwoColumnRow>
        <DashboardSection title="Region Server - Compaction">
          <ChartWithLegend
            snapshotId={snapshotId}
            timeframe={timeframe}
            margins={{
              left: 40,
              right: 40
            }}
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
          />
        </DashboardSection>
        <DashboardSection title="Region Server - Flush">
          <ChartWithLegend
            snapshotId={snapshotId}
            timeframe={timeframe}
            margins={{
              left: 40,
              right: 40
            }}
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
          />
        </DashboardSection>
      </TwoColumnRow>
      <TwoColumnRow>
        <DashboardSection title="Region Server - Store File">
          <ChartWithLegend
            snapshotId={snapshotId}
            timeframe={timeframe}
            margins={{
              left: 40,
              right: 40
            }}
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
          />
        </DashboardSection>
        <DashboardSection title="Region Server - Block cache">
          <ChartWithLegend
            snapshotId={snapshotId}
            timeframe={timeframe}
            margins={{
              left: 40,
              right: 40
            }}
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
              formatter: percentage
            }}
          />
        </DashboardSection>
      </TwoColumnRow>
    </div>
  );
}
