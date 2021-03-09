/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ClusterNodesTable from 'in-forge/plugins/redisEnterpriseCluster/Dashboard/ClusterNodesTable';
import DatabasesTable from 'in-forge/plugins/redisEnterpriseCluster/Dashboard/DatabasesTable';
import ShardsTable from 'in-forge/plugins/redisEnterpriseCluster/Dashboard/ShardsTable';
import ClusterSummary from 'in-forge/plugins/redisEnterpriseCluster/ClusterSummary';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { bytes, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default function RedisEnterpriseClusterDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <ClusterSummary snapshot={snapshot} />

      <DashboardSection title={t('in-forge:plugins.redisEnterpriseCluster.dashboard.keys')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['key_hits', 'key_misses'],
            labels: [
              t('in-forge:plugins.redisEnterpriseCluster.dashboard.hits'),
              t('in-forge:plugins.redisEnterpriseCluster.dashboard.misses')
            ],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['expired_objects', 'evicted_objects'],
            labels: [
              t('in-forge:plugins.redisEnterpriseCluster.dashboard.expired'),
              t('in-forge:plugins.redisEnterpriseCluster.dashboard.evicted')
            ],
            formatter: number.compact,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.redisEnterpriseCluster.dashboard.memory')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: bytes.compact,
            tooltipFormatter: bytes.detailed,
            metrics: ['used_memory', 'used_memory_rss', 'mem_size_lua'],
            labels: [
              t('in-forge:plugins.redisEnterpriseCluster.dashboard.used'),
              t('in-forge:plugins.redisEnterpriseCluster.dashboard.usedRss'),
              t('in-forge:plugins.redisEnterpriseCluster.dashboard.luaHeapSize')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.redisEnterpriseCluster.dashboard.connections')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: number.compact,
            metrics: ['conns'],
            labels: [t('in-forge:plugins.redisEnterpriseCluster.dashboard.connected')],
            type: 'line'
          }}
          y2={{
            min: 0,
            formatter: number.perSecond,
            metrics: ['total_connections_received'],
            labels: [t('in-forge:plugins.redisEnterpriseCluster.dashboard.totalReceived')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <ClusterNodesTable snapshot={snapshot} timeConfig={timeConfig} />
      <ShardsTable snapshot={snapshot} timeConfig={timeConfig} />
      <DatabasesTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
