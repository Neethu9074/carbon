import React from 'react';

import IndicesTable from 'in-forge/plugins/elasticsearchNode/Dashboard/IndicesTable.es6';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart';
import TwoColumnRow from 'in-sdk/components/dashboard/TwoColumnRow';
import {
  withSiMultiplyPrefixThreeDecimalPlaces,
  timeByMillisTwoDecimalPlaces,
  msTwoDecimalPlaces,
  withSiPrefixThreeDecimalPlaces,
  twoDecimalPlaces
} from 'in-services/formatters/number';

import NodeSummary from '../NodeSummary.es6';

export default function ElasticsearchDashboard({ snapshot, timeframe }) {
  return (
    <div>
      <NodeSummary snapshot={snapshot} />

      <DashboardSection title="Search Performance vs. Throughput">
        <Chart
          snapshotId={snapshot.get('id')}
          timeframe={timeframe}
          margins={{
            left: 80,
            right: 80
          }}
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
        />
      </DashboardSection>

      <TwoColumnRow>
        <DashboardSection title="Indices Count">
          <Chart
            snapshotId={snapshot.get('id')}
            timeframe={timeframe}
            margins={{
              left: 80
            }}
            y1={{
              min: 0,
              formatter: withSiPrefixThreeDecimalPlaces,
              tooltipFormatter: twoDecimalPlaces,
              metrics: ['indices_count'],
              labels: ['Indices'],
              type: 'line'
            }}
          />
        </DashboardSection>
        <DashboardSection title="Shards">
          <Chart
            snapshotId={snapshot.get('id')}
            timeframe={timeframe}
            margins={{
              left: 80
            }}
            y1={{
              min: 0,
              formatter: withSiPrefixThreeDecimalPlaces,
              tooltipFormatter: twoDecimalPlaces,
              metrics: ['shards.node_active_shards', 'shards.node_active_primary_shards'],
              labels: ['Active', 'Active Primary'],
              type: 'line'
            }}
          />
        </DashboardSection>
      </TwoColumnRow>

      <DashboardSection title="Documents">
        <Chart
          snapshotId={snapshot.get('id')}
          timeframe={timeframe}
          margins={{
            left: 80,
            right: 80
          }}
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
            metrics: ['indices.index_count', 'indices.deleted_count'],
            labels: ['Added', 'Removed'],
            type: 'line'
          }}
        />
      </DashboardSection>

      <IndicesTable snapshot={snapshot} timeframe={timeframe} />

      <DashboardSection title="Refresh and Flush">
        <Chart
          snapshotId={snapshot.get('id')}
          timeframe={timeframe}
          margins={{
            left: 80,
            right: 80
          }}
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
        />
      </DashboardSection>

      <DashboardSection title="Lucene Segments">
        <Chart
          snapshotId={snapshot.get('id')}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            min: 0,
            metrics: ['indices.segment_count'],
            labels: ['Segments'],
            formatter: withSiMultiplyPrefixThreeDecimalPlaces,
            tooltipFormatter: twoDecimalPlaces,
            type: 'stackedArea'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Active Threads">
        <Chart
          snapshotId={snapshot.get('id')}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
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
        />
      </DashboardSection>
      <DashboardSection title="Rejected Threads">
        <Chart
          snapshotId={snapshot.get('id')}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
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
        />
      </DashboardSection>
      <DashboardSection title="Queued Threads">
        <Chart
          snapshotId={snapshot.get('id')}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
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
        />
      </DashboardSection>
    </div>
  );
}
