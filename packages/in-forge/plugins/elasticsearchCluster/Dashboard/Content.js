/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  withSiPrefixZeroDecimalPlaces,
  withSiPrefixThreeDecimalPlaces,
  twoDecimalPlaces,
  msTwoDecimalPlaces,
  msZeroDecimalPlaces,
  bytesZeroDecimalPlaces,
  bytesTwoDecimalPlaces
} from 'in-services/formatters/number';
import ClusterNodesTable from 'in-forge/plugins/elasticsearchCluster/Dashboard/ClusterNodesTable';
import IndicesTable from 'in-forge/plugins/elasticsearchCluster/Dashboard/IndicesTable.js';
import ClusterSummary from 'in-forge/plugins/elasticsearchCluster/ClusterSummary';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import { t } from 'in-i18n';

export default function ElasticsearchClusterDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <ClusterSummary snapshot={snapshot} />

      <DashboardSection title={t('in-forge:plugins.elasticsearchCluster.dashboard.latencyVsNumberOfQueries')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: msZeroDecimalPlaces,
            tooltipFormatter: msTwoDecimalPlaces,
            metrics: ['query_latency'],
            labels: [t('in-forge:plugins.elasticsearchCluster.dashboard.latency')],
            type: 'line'
          }}
          y2={{
            min: 0,
            formatter: withSiPrefixZeroDecimalPlaces,
            tooltipFormatter: twoDecimalPlaces,
            metrics: ['query_count'],
            labels: [t('in-forge:plugins.elasticsearchCluster.dashboard.numberOfQueries')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.elasticsearchCluster.dashboard.documents')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: withSiPrefixThreeDecimalPlaces,
            tooltipFormatter: twoDecimalPlaces,
            metrics: ['document_count'],
            labels: [t('in-forge:plugins.elasticsearchCluster.dashboard.overallDocuments')],
            type: 'line'
          }}
          y2={{
            min: 0,
            formatter: withSiPrefixThreeDecimalPlaces,
            tooltipFormatter: twoDecimalPlaces,
            metrics: ['index_count', 'delete_count'],
            labels: [
              t('in-forge:plugins.elasticsearchCluster.dashboard.added'),
              t('in-forge:plugins.elasticsearchCluster.dashboard.removed')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.elasticsearchCluster.dashboard.indices')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: withSiPrefixZeroDecimalPlaces,
              tooltipFormatter: twoDecimalPlaces,
              metrics: ['indices_count'],
              labels: [t('in-forge:plugins.elasticsearchCluster.dashboard.indices')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.elasticsearchCluster.dashboard.shards')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: withSiPrefixThreeDecimalPlaces,
              tooltipFormatter: twoDecimalPlaces,
              metrics: [
                'active_shards',
                'active_primaryshards',
                'initializing_shards',
                'relocating_shards',
                'unassigned_shards'
              ],
              labels: [
                t('in-forge:plugins.elasticsearchCluster.dashboard.active'),
                t('in-forge:plugins.elasticsearchCluster.dashboard.activePrimary'),
                t('in-forge:plugins.elasticsearchCluster.dashboard.initializing'),
                t('in-forge:plugins.elasticsearchCluster.dashboard.relocating'),
                t('in-forge:plugins.elasticsearchCluster.dashboard.unassigned')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.elasticsearchCluster.dashboard.clusterStoreSize')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: withSiPrefixZeroDecimalPlaces,
              tooltipFormatter: withSiPrefixThreeDecimalPlaces,
              metrics: ['store_size'],
              labels: [t('in-forge:plugins.elasticsearchCluster.dashboard.clusterStoreSize')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.elasticsearchCluster.dashboard.clusterStateSize')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: bytesZeroDecimalPlaces,
              tooltipFormatter: bytesTwoDecimalPlaces,
              metrics: ['clusterState.totalStateSize'],
              labels: [t('in-forge:plugins.elasticsearchCluster.dashboard.clusterStateSize')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <ClusterNodesTable clusterSnapshotId={snapshot.get('id')} timeConfig={timeConfig} />

      <IndicesTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
