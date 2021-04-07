/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { bytes, number, millis, kiloBytes, hitRateZeroDecimalPlaces } from 'in-services/formatters/number';
import PubSubChannelsTable from 'in-forge/plugins/redis/Dashboard/PubSubChannelsTable';
import CustomMonitorsTable from 'in-forge/plugins/redis/Dashboard/CustomMonitorsTable';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DatabasesTable from 'in-forge/plugins/redis/Dashboard/DatabasesTable';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import SlowLogsTable from 'in-forge/plugins/redis/Dashboard/SlowLogsTable';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { emptyList } from 'in-services/fixedImmutables';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

const persistenceFormatter = d =>
  d < 0
    ? t('in-forge:plugins.redis.dashboard.notInProgress')
    : t('in-forge:plugins.redis.dashboard.seconds', { number: number.compact(d) });

const latencyFormatter = (d, threshold) =>
  d < threshold
    ? t('in-forge:plugins.redis.dashboard.lessThan', {
        threshold: millis.compact(threshold)
      })
    : millis.compact(d);

function getConnectionMetricsForRole(role) {
  return role === 'master'
    ? ['connected_clients', 'blocked_clients', 'rejected_connections', 'master_connected_slaves']
    : ['connected_clients', 'blocked_clients', 'rejected_connections'];
}

function getConnectionLabelsForRole(role) {
  return role === 'master'
    ? [
        t('in-forge:plugins.redis.dashboard.connected'),
        t('in-forge:plugins.redis.dashboard.blocked'),
        t('in-forge:plugins.redis.dashboard.rejectedConnections'),
        t('in-forge:plugins.redis.dashboard.connectedSlaves')
      ]
    : [
        t('in-forge:plugins.redis.dashboard.connected'),
        t('in-forge:plugins.redis.dashboard.blocked'),
        t('in-forge:plugins.redis.dashboard.rejectedConnections')
      ];
}

export default function RedisDashboard({ snapshot, timeConfig }) {
  const data = snapshot.get('data');

  const latencyThreshold = snapshot.getIn(['data', 'latency_monitor_threshold']);
  const channelNames = data.get('channels', emptyList).toArray();
  const snapshotId = snapshot.get('id');
  const role = data.get('role');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.redis.dashboard.throughput')}>
          <MetricValue snapshotId={snapshotId} metric="throughput" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.redis.dashboard.hitRateKpiLabel')}>
          <MetricValue snapshotId={snapshotId} metric="hit_rate" formatter={hitRateZeroDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.redis.dashboard.keysEvicted')}>
          <MetricValue snapshotId={snapshotId} metric="evicted_keys" />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.redis.dashboard.connections')}>
          <MetricValue snapshotId={snapshotId} metric="connected_clients" />
        </KpiKeyValue>
      </KpiSection>

      {latencyThreshold > 0 ? (
        <DashboardSection title={t('in-forge:plugins.redis.dashboard.latency')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: latencyThreshold,
              metrics: ['latency_max'],
              labels: [t('in-forge:plugins.redis.dashboard.latency')],
              formatter: latencyFormatter.bind(latencyThreshold),
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      ) : null}

      <DashboardSection title={t('in-forge:plugins.redis.dashboard.throughput')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['throughput'],
            labels: [t('in-forge:plugins.redis.dashboard.throughputOpsSec')],
            formatter: number.detailed,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.redis.dashboard.key')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['keyspace_hits', 'keyspace_misses'],
            labels: [t('in-forge:plugins.redis.dashboard.hits'), t('in-forge:plugins.redis.dashboard.misses')],
            type: 'line'
          }}
          y2={{
            min: 0,
            max: 1,
            metrics: ['hit_rate'],
            labels: [t('in-forge:plugins.redis.dashboard.hitRateKpiLabel')],
            type: 'line',
            formatter: hitRateZeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.redis.dashboard.objects')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['expired_keys', 'evicted_keys'],
            labels: [
              t('in-forge:plugins.redis.dashboard.keysExpired'),
              t('in-forge:plugins.redis.dashboard.keysEvicted')
            ],
            formatter: number.detailed,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.redis.dashboard.memory')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: bytes.compact,
            tooltipFormatter: bytes.detailed,
            metrics: ['used_memory', 'used_memory_rss', 'used_memory_lua'],
            labels: [
              t('in-forge:plugins.redis.dashboard.used'),
              t('in-forge:plugins.redis.dashboard.usedRss'),
              t('in-forge:plugins.redis.dashboard.usedLua')
            ],
            type: 'line'
          }}
          y2={{
            min: 0,
            formatter: number.detailed,
            metrics: ['mem_fragmentation_ratio'],
            labels: [t('in-forge:plugins.redis.dashboard.fragmentationRatio')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.redis.dashboard.connections')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: getConnectionMetricsForRole(role),
            labels: getConnectionLabelsForRole(role),
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <PubSubChannelsTable snapshot={snapshot} timeConfig={timeConfig} />

      {channelNames && (
        <DashboardSection title={t('in-forge:plugins.redis.dashboard.pubSubSubscribedPatterns')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['pubsub_subscribed_patterns'],
              labels: [t('in-forge:plugins.redis.dashboard.subscribedPatterns')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      )}

      <DashboardSection title={t('in-forge:plugins.redis.dashboard.persistence')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['rdb_current_bgsave_time_sec', 'aof_current_rewrite_time_sec'],
            labels: [
              t('in-forge:plugins.redis.dashboard.durationOfCurrentRdbSave'),
              t('in-forge:plugins.redis.dashboard.durationOfCurrentAofLogRewrite')
            ],
            formatter: persistenceFormatter,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <SlowLogsTable snapshotId={snapshotId} />

      {role === 'slave' ? (
        <DashboardSection title={t('in-forge:plugins.redis.dashboard.bytesLeftBeforeSyncingIsComplete')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: kiloBytes.compact,
              tooltipFormatter: kiloBytes.detailed,
              metrics: ['master_sync_left_bytes'],
              labels: [t('in-forge:plugins.redis.dashboard.bytesLeftBeforeSyncingIsComplete')],
              type: 'stackedArea'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      ) : null}

      <DatabasesTable snapshot={snapshot} timeConfig={timeConfig} />

      <CustomMonitorsTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
