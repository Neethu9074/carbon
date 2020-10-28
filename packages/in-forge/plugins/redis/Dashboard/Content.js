import React from 'react';

import { bytes, number, millis, kiloBytes, hitRateZeroDecimalPlaces } from 'in-services/formatters/number';
import PubSubChannelsTable from 'in-forge/plugins/redis/Dashboard/PubSubChannelsTable';
import CustomMonitorsTable from 'in-forge/plugins/redis/Dashboard/CustomMonitorsTable';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import DatabasesTable from 'in-forge/plugins/redis/Dashboard/DatabasesTable';
import SlowLogsTable from 'in-forge/plugins/redis/Dashboard/SlowLogsTable';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import DashboardNotification from 'in-components/DashboardNotification';
import { emptyList } from 'in-services/fixedImmutables';
import MetricValue from 'in-components/MetricValue';

const persistenceFormatter = d => (d < 0 ? 'Not in progress' : number.compact(d) + 's');

const latencyFormatter = (d, threshold) =>
  d < threshold ? 'Less than ' + millis.compact(threshold) : millis.compact(d);

function getConnectionMetricsForRole(role) {
  return role === 'master'
    ? ['connected_clients', 'blocked_clients', 'rejected_connections', 'master_connected_slaves']
    : ['connected_clients', 'blocked_clients', 'rejected_connections'];
}

function getConnectionLabelsForRole(role) {
  return role === 'master'
    ? ['Connected', 'Blocked', 'Rejected connections', 'Connected slaves']
    : ['Connected', 'Blocked', 'Rejected connections'];
}

export default function RedisDashboard({ snapshot, timeConfig }) {
  const data = snapshot.get('data');
  const sensorConnectionStatus = data.get('sensorConnectionStatus', 'OK');
  if (sensorConnectionStatus !== 'OK') {
    return <DashboardNotification type="info">{sensorConnectionStatus}</DashboardNotification>;
  }

  const latencyThreshold = snapshot.getIn(['data', 'latency_monitor_threshold']);
  const channelNames = data.get('channels', emptyList).toArray();
  const snapshotId = snapshot.get('id');
  const role = data.get('role');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label="Throughput">
          <MetricValue snapshotId={snapshotId} metric="throughput" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label="Hit Rate">
          <MetricValue snapshotId={snapshotId} metric="hit_rate" formatter={hitRateZeroDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label="Keys Evicted">
          <MetricValue snapshotId={snapshotId} metric="evicted_keys" />
        </KpiKeyValue>
        <KpiKeyValue label="Connections">
          <MetricValue snapshotId={snapshotId} metric="connected_clients" />
        </KpiKeyValue>
      </KpiSection>

      {latencyThreshold > 0 ? (
        <DashboardSection title="Latency">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: latencyThreshold,
              metrics: ['latency_max'],
              labels: ['Latency'],
              formatter: latencyFormatter.bind(latencyThreshold),
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      ) : null}

      <DashboardSection title="Throughput">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['throughput'],
            labels: ['Throughput (ops/sec)'],
            formatter: number.detailed,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Key">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['keyspace_hits', 'keyspace_misses'],
            labels: ['Hits', 'Misses'],
            type: 'line'
          }}
          y2={{
            min: 0,
            max: 1,
            metrics: ['hit_rate'],
            labels: ['Hit Rate'],
            type: 'line',
            formatter: hitRateZeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Objects">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['expired_keys', 'evicted_keys'],
            labels: ['Keys Expired', 'Keys Evicted'],
            formatter: number.detailed,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Memory">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: bytes.compact,
            tooltipFormatter: bytes.detailed,
            metrics: ['used_memory', 'used_memory_rss', 'used_memory_lua'],
            labels: ['Used', 'Used rss', 'Used lua'],
            type: 'line'
          }}
          y2={{
            min: 0,
            formatter: number.detailed,
            metrics: ['mem_fragmentation_ratio'],
            labels: ['Fragmentation ratio'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Connections">
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
        <DashboardSection title="Pub / Sub Subscribed patterns">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['pubsub_subscribed_patterns'],
              labels: ['Subscribed patterns'],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      )}

      <DashboardSection title="Persistence">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['rdb_current_bgsave_time_sec', 'aof_current_rewrite_time_sec'],
            labels: ['Duration of current rdb save', 'Duration of current aof log rewrite'],
            formatter: persistenceFormatter,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <SlowLogsTable snapshotId={snapshotId} />

      {role === 'slave' ? (
        <DashboardSection title="Bytes left before syncing is complete">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: kiloBytes.compact,
              tooltipFormatter: kiloBytes.detailed,
              metrics: ['master_sync_left_bytes'],
              labels: ['Bytes left before syncing is complete'],
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
