/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { bytesTwoDecimalPlaces, bytesZeroDecimalPlaces, number } from 'in-services/formatters/number';
import ClusterNodesTable from 'in-forge/plugins/redisCluster/Dashboard/ClusterNodesTable.js';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartExplanation from 'in-sdk/components/dashboard/ChartExplanation';
import ClusterSummary from 'in-forge/plugins/redisCluster/ClusterSummary';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { t } from 'in-i18n';

export default function RedisClusterDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <Fragment>
      <ClusterSummary snapshot={snapshot} />
      <DashboardSection title={t('in-forge:plugins.redisCluster.dashboard.throughput')}>
        <ChartExplanation>
          {t('in-forge:plugins.redisCluster.dashboard.throughputMetricChartExplanation')}
        </ChartExplanation>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['throughput'],
            labels: [t('in-forge:plugins.redisCluster.dashboard.throughputOpsSec')],
            formatter: number,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.redisCluster.dashboard.key')}>
        <ChartExplanation>
          {t('in-forge:plugins.redisCluster.dashboard.throughputKeyHitMissChartExplanation')}
        </ChartExplanation>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['keyspace_hits', 'keyspace_misses'],
            labels: [
              t('in-forge:plugins.redisCluster.dashboard.hits'),
              t('in-forge:plugins.redisCluster.dashboard.misses')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.redisCluster.dashboard.objects')}>
        <ChartExplanation>
          {t('in-forge:plugins.redisCluster.dashboard.throughputKeyExpiredEvictedChartExplanation')}
        </ChartExplanation>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['expired_keys', 'evicted_keys'],
            labels: [
              t('in-forge:plugins.redisCluster.dashboard.keysExpired'),
              t('in-forge:plugins.redisCluster.dashboard.keysEvicted')
            ],
            formatter: number,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.redisCluster.dashboard.memory')}>
        <ChartExplanation>
          {t('in-forge:plugins.redisCluster.dashboard.memoryMetricsChartExplanation')}
        </ChartExplanation>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: bytesZeroDecimalPlaces,
            tooltipFormatter: bytesTwoDecimalPlaces,
            metrics: ['used_memory', 'used_memory_rss', 'used_memory_lua'],
            labels: [
              t('in-forge:plugins.redisCluster.dashboard.used'),
              t('in-forge:plugins.redisCluster.dashboard.usedRss'),
              t('in-forge:plugins.redisCluster.dashboard.usedLua')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.redisCluster.dashboard.connections')}>
        <ChartExplanation>
          {t('in-forge:plugins.redisCluster.dashboard.connectionsMetricsChartExplanation')}
        </ChartExplanation>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['connected_clients', 'blocked_clients', 'rejected_connections'],
            labels: [
              t('in-forge:plugins.redisCluster.dashboard.connected'),
              t('in-forge:plugins.redisCluster.dashboard.blocked'),
              t('in-forge:plugins.redisCluster.dashboard.rejectedConnections')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.redisCluster.dashboard.messages')}>
        <ChartExplanation>
          {t('in-forge:plugins.redisCluster.dashboard.messagesSendReceivedChartExplanation')}
        </ChartExplanation>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['cluster_stats_messages_sent', 'cluster_stats_messages_received'],
            labels: [
              t('in-forge:plugins.redisCluster.dashboard.sent'),
              t('in-forge:plugins.redisCluster.dashboard.received')
            ],
            formatter: number.compact,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <ClusterNodesTable snapshot={snapshot} timeConfig={timeConfig} />
    </Fragment>
  );
}
