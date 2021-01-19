/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import {
  withSiMultiplyPrefixThreeDecimalPlaces,
  timeByMillisTwoDecimalPlaces,
  msTwoDecimalPlaces,
  withSiPrefixThreeDecimalPlaces,
  withSiPrefixZeroDecimalPlaces,
  twoDecimalPlaces,
  bytes
} from 'in-services/formatters/number';
import IndicesTable from 'in-forge/plugins/elasticsearchNode/Dashboard/IndicesTable.js';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import NodeSummary from '../NodeSummary.js';

export default function ElasticsearchDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <NodeSummary snapshot={snapshot} />

      <DashboardSection title="Latency vs. Number of Queries">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: msTwoDecimalPlaces,
            metrics: ['indices.query_latency'],
            labels: ['Latency'],
            type: 'line'
          }}
          y2={{
            min: 0,
            formatter: withSiPrefixThreeDecimalPlaces,
            tooltipFormatter: twoDecimalPlaces,
            metrics: ['indices.query_count'],
            labels: ['Number Of Queries'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Documents">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: withSiPrefixThreeDecimalPlaces,
            tooltipFormatter: twoDecimalPlaces,
            metrics: ['indices.document_count'],
            labels: ['Overall Documents'],
            type: 'line'
          }}
          y2={{
            min: 0,
            formatter: withSiPrefixThreeDecimalPlaces,
            tooltipFormatter: twoDecimalPlaces,
            metrics: ['indices.index_count', 'indices.delete_count'],
            labels: ['Added', 'Removed'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <Columize>
        <DashboardSection title="Indices Count">
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: withSiPrefixThreeDecimalPlaces,
              tooltipFormatter: twoDecimalPlaces,
              metrics: ['indices_count'],
              labels: ['Indices'],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title="Shards">
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: withSiPrefixThreeDecimalPlaces,
              tooltipFormatter: twoDecimalPlaces,
              metrics: ['shards.node_active_shards', 'shards.node_active_primary_shards'],
              labels: ['Active', 'Active Primary'],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <DashboardSection title="Size">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: withSiPrefixZeroDecimalPlaces,
            tooltipFormatter: withSiPrefixThreeDecimalPlaces,
            metrics: ['indices.store_size'],
            labels: ['Store Size'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <IndicesTable snapshot={snapshot} timeConfig={timeConfig} />

      <DashboardSection title="Refresh and Flush">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            metrics: ['indices.refresh_count', 'indices.flush_count'],
            labels: ['Refresh Count', 'Flush Count'],
            formatter: withSiMultiplyPrefixThreeDecimalPlaces,
            tooltipFormatter: twoDecimalPlaces,
            type: 'line'
          }}
          y2={{
            metrics: ['indices.refresh_time', 'indices.flush_time'],
            labels: ['Refresh Time', 'Flush Time'],
            formatter: timeByMillisTwoDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Lucene Segments">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['indices.segment_count'],
            labels: ['Segments'],
            formatter: withSiMultiplyPrefixThreeDecimalPlaces,
            tooltipFormatter: twoDecimalPlaces,
            type: 'stackedArea'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Active Threads">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: [
              'threads.search_active',
              'threads.index_active',
              'threads.bulk_active',
              'threads.merge_active',
              'threads.flush_active',
              'threads.get_active',
              'threads.management_active',
              'threads.refresh_active'
            ],
            labels: ['Search', 'Index', 'Bulk', 'Merge', 'Flush', 'Get', 'Management', 'Refresh'],
            formatter: twoDecimalPlaces,
            type: 'stackedArea'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Queued Tasks">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: [
              'threads.search_queue',
              'threads.index_queue',
              'threads.bulk_queue',
              'threads.merge_queue',
              'threads.flush_queue',
              'threads.get_queue',
              'threads.management_queue',
              'threads.refresh_queue'
            ],
            labels: ['Search', 'Index', 'Bulk', 'Merge', 'Flush', 'Get', 'Management', 'Refresh'],
            formatter: twoDecimalPlaces,
            type: 'stackedArea'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Rejected Tasks">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: [
              'threads.search_rejected',
              'threads.index_rejected',
              'threads.bulk_rejected',
              'threads.get_rejected'
            ],
            labels: ['Search', 'Index', 'Bulk', 'Get'],
            formatter: twoDecimalPlaces,
            type: 'stackedArea'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Transport">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['tx_count', 'rx_count'],
            labels: ['Sent', 'Received'],
            formatter: bytes.detailed,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
