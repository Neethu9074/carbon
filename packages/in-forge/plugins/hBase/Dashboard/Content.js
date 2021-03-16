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
import { t } from 'in-i18n';

export default function HBaseDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.hBase.dashboard.clusterRequests')}>
          <MetricValue snapshotId={snapshotId} metric="master_cluster_requests" formatter={zeroDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.hBase.dashboard.averageLoad')}>
          <MetricValue snapshotId={snapshotId} metric="avg_load" formatter={zeroDecimalPlaces} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.hBase.dashboard.masterServer')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['master_cluster_requests'],
            labels: [t('in-forge:plugins.hBase.dashboard.clusterRequests')],
            min: 0,
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.hBase.dashboard.statistics')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['stats_active_sinks', 'stats_active_sources'],
            labels: [
              t('in-forge:plugins.hBase.dashboard.activeSinks'),
              t('in-forge:plugins.hBase.dashboard.activeSources')
            ],
            min: 0,
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.hBase.dashboard.publish')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['stats_pub_ops'],
            labels: [t('in-forge:plugins.hBase.dashboard.publishOperations')],
            min: 0,
            type: 'line',
            formatter: twoDecimalPlaces
          }}
          y2={{
            metrics: ['stats_pub_avg_time'],
            labels: [t('in-forge:plugins.hBase.dashboard.publishAverageTime')],
            min: 0,
            type: 'line',
            formatter: msZeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.hBase.dashboard.snapshot')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['stats_snap_ops'],
            labels: [t('in-forge:plugins.hBase.dashboard.snapshotOperations')],
            min: 0,
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
          y2={{
            metrics: ['stats_snap_avg_time'],
            labels: [t('in-forge:plugins.hBase.dashboard.snapshotAverageTime')],
            min: 0,
            type: 'line',
            formatter: msZeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.hBase.dashboard.regionServerSplit')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['rs_split_request_count', 'rs_split_success_count'],
            labels: [
              t('in-forge:plugins.hBase.dashboard.splitRequests'),
              t('in-forge:plugins.hBase.dashboard.splitSuccess')
            ],
            min: 0,
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.hBase.dashboard.regionServerCompaction')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['rs_comp_queue_length'],
              labels: [t('in-forge:plugins.hBase.dashboard.compactionQueueLength')],
              min: 0,
              type: 'line',
              formatter: zeroDecimalPlaces
            }}
            y2={{
              metrics: ['rs_comp_cells_count', 'rs_comp_cells_size'],
              labels: [
                t('in-forge:plugins.hBase.dashboard.compactionCellCount'),
                t('in-forge:plugins.hBase.dashboard.compactionCellSize')
              ],
              min: 0,
              type: 'line',
              formatter: zeroDecimalPlaces
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.hBase.dashboard.regionServerFlush')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['rs_flush_queue_length'],
              labels: [t('in-forge:plugins.hBase.dashboard.flushQueueLength')],
              min: 0,
              type: 'line',
              formatter: zeroDecimalPlaces
            }}
            y2={{
              metrics: ['rs_flush_cells_count', 'rs_flush_cells_size'],
              labels: [
                t('in-forge:plugins.hBase.dashboard.flushCellCount'),
                t('in-forge:plugins.hBase.dashboard.flushCellSize')
              ],
              min: 0,
              type: 'line',
              formatter: zeroDecimalPlaces
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.hBase.dashboard.regionServerStoreFile')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['rs_store_file_count'],
              labels: [t('in-forge:plugins.hBase.dashboard.storeFileCount')],
              min: 0,
              type: 'line',
              formatter: zeroDecimalPlaces
            }}
            y2={{
              metrics: ['rs_store_file_index_size', 'rs_store_file_size'],
              labels: [
                t('in-forge:plugins.hBase.dashboard.storeFileIndexSize'),
                t('in-forge:plugins.hBase.dashboard.storeFileSize')
              ],
              min: 0,
              type: 'line',
              formatter: bytesTwoDecimalPlaces
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.hBase.dashboard.regionServerBlockCache')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['rs_blk_cache_hit_count', 'rs_blk_cache_miss_count'],
              labels: [
                t('in-forge:plugins.hBase.dashboard.blockCacheHit'),
                t('in-forge:plugins.hBase.dashboard.blockCacheMiss')
              ],
              min: 0,
              type: 'line',
              formatter: zeroDecimalPlaces
            }}
            y2={{
              metrics: ['rs_blk_cache_hit_rate'],
              labels: [t('in-forge:plugins.hBase.dashboard.blockCacheHitRate')],
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
