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
import { t } from 'in-i18n';

export default function ElasticsearchDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <NodeSummary snapshot={snapshot} />

      <DashboardSection title={t('in-forge:plugins.elasticsearchNode.dashboard.latencyVsNumberOfQueries')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: msTwoDecimalPlaces,
            metrics: ['indices.query_latency'],
            labels: [t('in-forge:plugins.elasticsearchNode.dashboard.latency')],
            type: 'line'
          }}
          y2={{
            min: 0,
            formatter: withSiPrefixThreeDecimalPlaces,
            tooltipFormatter: twoDecimalPlaces,
            metrics: ['indices.query_count'],
            labels: [t('in-forge:plugins.elasticsearchNode.dashboard.numberOfQueries')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.elasticsearchNode.dashboard.documents')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: withSiPrefixThreeDecimalPlaces,
            tooltipFormatter: twoDecimalPlaces,
            metrics: ['indices.document_count'],
            labels: [t('in-forge:plugins.elasticsearchNode.dashboard.overallDocuments')],
            type: 'line'
          }}
          y2={{
            min: 0,
            formatter: withSiPrefixThreeDecimalPlaces,
            tooltipFormatter: twoDecimalPlaces,
            metrics: ['indices.index_count', 'indices.delete_count'],
            labels: [
              t('in-forge:plugins.elasticsearchNode.dashboard.added'),
              t('in-forge:plugins.elasticsearchNode.dashboard.removed')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.elasticsearchNode.dashboard.indicesCount')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: withSiPrefixThreeDecimalPlaces,
              tooltipFormatter: twoDecimalPlaces,
              metrics: ['indices_count'],
              labels: [t('in-forge:plugins.elasticsearchNode.dashboard.indices')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.elasticsearchNode.dashboard.shards')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: withSiPrefixThreeDecimalPlaces,
              tooltipFormatter: twoDecimalPlaces,
              metrics: ['shards.node_active_shards', 'shards.node_active_primary_shards'],
              labels: [
                t('in-forge:plugins.elasticsearchNode.dashboard.active'),
                t('in-forge:plugins.elasticsearchNode.dashboard.activePrimary')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <DashboardSection title={t('in-forge:plugins.elasticsearchNode.dashboard.size')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: withSiPrefixZeroDecimalPlaces,
            tooltipFormatter: withSiPrefixThreeDecimalPlaces,
            metrics: ['indices.store_size'],
            labels: [t('in-forge:plugins.elasticsearchNode.dashboard.storeSize')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <IndicesTable snapshot={snapshot} timeConfig={timeConfig} />

      <DashboardSection title={t('in-forge:plugins.elasticsearchNode.dashboard.refreshAndFlush')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            metrics: ['indices.refresh_count', 'indices.flush_count'],
            labels: [
              t('in-forge:plugins.elasticsearchNode.dashboard.refreshCount'),
              t('in-forge:plugins.elasticsearchNode.dashboard.flushCount')
            ],
            formatter: withSiMultiplyPrefixThreeDecimalPlaces,
            tooltipFormatter: twoDecimalPlaces,
            type: 'line'
          }}
          y2={{
            metrics: ['indices.refresh_time', 'indices.flush_time'],
            labels: [
              t('in-forge:plugins.elasticsearchNode.dashboard.refreshTime'),
              t('in-forge:plugins.elasticsearchNode.dashboard.flushTime')
            ],
            formatter: timeByMillisTwoDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.elasticsearchNode.dashboard.luceneSegments')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['indices.segment_count'],
            labels: [t('in-forge:plugins.elasticsearchNode.dashboard.segments')],
            formatter: withSiMultiplyPrefixThreeDecimalPlaces,
            tooltipFormatter: twoDecimalPlaces,
            type: 'stackedArea'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.elasticsearchNode.dashboard.activeThreads')}>
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
            labels: [
              t('in-forge:plugins.elasticsearchNode.dashboard.search'),
              t('in-forge:plugins.elasticsearchNode.dashboard.index'),
              t('in-forge:plugins.elasticsearchNode.dashboard.bulk'),
              t('in-forge:plugins.elasticsearchNode.dashboard.merge'),
              t('in-forge:plugins.elasticsearchNode.dashboard.flush'),
              t('in-forge:plugins.elasticsearchNode.dashboard.get'),
              t('in-forge:plugins.elasticsearchNode.dashboard.management'),
              t('in-forge:plugins.elasticsearchNode.dashboard.refresh')
            ],
            formatter: twoDecimalPlaces,
            type: 'stackedArea'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.elasticsearchNode.dashboard.queuedTasks')}>
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
            labels: [
              t('in-forge:plugins.elasticsearchNode.dashboard.search'),
              t('in-forge:plugins.elasticsearchNode.dashboard.index'),
              t('in-forge:plugins.elasticsearchNode.dashboard.bulk'),
              t('in-forge:plugins.elasticsearchNode.dashboard.merge'),
              t('in-forge:plugins.elasticsearchNode.dashboard.flush'),
              t('in-forge:plugins.elasticsearchNode.dashboard.get'),
              t('in-forge:plugins.elasticsearchNode.dashboard.management'),
              t('in-forge:plugins.elasticsearchNode.dashboard.refresh')
            ],
            formatter: twoDecimalPlaces,
            type: 'stackedArea'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.elasticsearchNode.dashboard.rejectedTasks')}>
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
            labels: [
              t('in-forge:plugins.elasticsearchNode.dashboard.search'),
              t('in-forge:plugins.elasticsearchNode.dashboard.index'),
              t('in-forge:plugins.elasticsearchNode.dashboard.bulk'),
              t('in-forge:plugins.elasticsearchNode.dashboard.get')
            ],
            formatter: twoDecimalPlaces,
            type: 'stackedArea'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.elasticsearchNode.dashboard.transport')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['tx_count', 'rx_count'],
            labels: [
              t('in-forge:plugins.elasticsearchNode.dashboard.sent'),
              t('in-forge:plugins.elasticsearchNode.dashboard.received')
            ],
            formatter: bytes.detailed,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
