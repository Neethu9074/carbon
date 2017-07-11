import React from 'react';

import {
  bytesZeroDecimalPlaces,
  bytesTwoDecimalPlaces,
  zeroDecimalPlaces,
  twoDecimalPlaces,
  msZeroDecimalPlaces,
  kiloBytesZeroDecimalPlaces,
  kiloBytesTwoDecimalPlaces,
  hitRateZeroDecimalPlaces
} from 'in-services/formatters/number';
import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import CustomMonitorsTable from 'in-forge/plugins/redis/Dashboard/CustomMonitorsTable';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import SlowLogsTable from 'in-forge/plugins/redis/Dashboard/SlowLogsTable';
import DashboardNotification from 'in-components/DashboardNotification';
import Chart from 'in-components/Chart';
import { emptyList } from 'in-services/fixedImmutables';
import MetricValue from 'in-components/MetricValue';
import { getLabel } from 'in-sdk/snapshot';

const persistenceFormater = d => (d < 0 ? 'Not in progress' : twoDecimalPlaces(d) + 's');
const latencyFormatter = (d, threshold) =>
  d < threshold ? 'Less than ' + msZeroDecimalPlaces(threshold) : msZeroDecimalPlaces(d);

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

function dbKeysMetrics(dbNames) {
  const metrics = [];
  metrics.push(dbNames.map(name => 'db.' + name + '.count')[0]);
  metrics.push(dbNames.map(name => 'db.' + name + '.expires')[0]);
  return metrics;
}

function dbKeysLabels(dbNames) {
  const labels = [];
  labels.push(dbNames.map(name => name + ' Keys Count')[0]);
  labels.push(dbNames.map(name => name + ' Keys Expires')[0]);
  return labels;
}

function pubSubMetrics(channelNames) {
  return channelNames.map(name => 'pubsub_subscribers.' + name);
}

export default function RedisDashboard({ snapshot, timeframe }) {
  const data = snapshot.get('data');
  const sensorConnectionStatus = data.get('sensorConnectionStatus', 'OK');
  if (sensorConnectionStatus !== 'OK') {
    return (
      <DashboardNotification type="info">
        {sensorConnectionStatus}
      </DashboardNotification>
    );
  }

  const latencyThreshold = snapshot.getIn(['data', 'latency_monitor_threshold']);
  const channelNames = data.get('channels', emptyList).toArray();
  const dbNames = data.get('dbs', emptyList).toArray();
  const snapshotId = snapshot.get('id');
  const role = data.get('role');

  return (
    <div>
      <KpiSection>
        <KpiHeading>
          {getLabel(snapshot)}
        </KpiHeading>
        <KpiKeyValue label="Throughput">
          <MetricValue snapshotId={snapshotId} metric="throughput" formatter={zeroDecimalPlaces} />
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

      {latencyThreshold > 0
        ? <DashboardSection title="Latency">
            <Chart
              snapshotId={snapshotId}
              timeframe={timeframe}
              margins={{
                left: 80
              }}
              y1={{
                min: latencyThreshold,
                metrics: ['latency_max'],
                labels: ['Latency'],
                formatter: latencyFormatter.bind(latencyThreshold),
                type: 'line'
              }}
            />
          </DashboardSection>
        : null}

      <DashboardSection title="Throughput">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            metrics: ['throughput'],
            labels: ['Throughput (ops/sec)'],
            formatter: zeroDecimalPlaces,
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Key Hits/Misses">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80,
            right: 80
          }}
          y1={{
            min: 0,
            metrics: ['keyspace_hits', 'keyspace_misses'],
            labels: ['Key Hits', 'Key Misses'],
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
        />
      </DashboardSection>
      <DashboardSection title="Key Expired/Evicted">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            min: 0,
            metrics: ['expired_keys', 'evicted_keys'],
            labels: ['Keys Expired', 'Keys Evicted'],
            type: 'line'
          }}
        />
      </DashboardSection>
      {dbNames && dbNames.length > 0
        ? <DashboardSection title="Database">
            <Chart
              snapshotId={snapshotId}
              timeframe={timeframe}
              margins={{
                left: 80
              }}
              y1={{
                metrics: dbKeysMetrics(dbNames),
                labels: dbKeysLabels(dbNames),
                type: 'line'
              }}
            />
          </DashboardSection>
        : null}
      <DashboardSection title="Memory">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            min: 0,
            formatter: bytesZeroDecimalPlaces,
            tooltipFormatter: bytesTwoDecimalPlaces,
            metrics: ['used_memory', 'used_memory_rss', 'used_memory_lua'],
            labels: ['Used', 'Used rss', 'Used lua'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Connections">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            min: 0,
            metrics: getConnectionMetricsForRole(role),
            labels: getConnectionLabelsForRole(role),
            type: 'line'
          }}
        />
      </DashboardSection>
      {channelNames && channelNames.length > 0
        ? <DashboardSection title="Pub/Sub">
            <Chart
              snapshotId={snapshotId}
              timeframe={timeframe}
              margins={{
                left: 80,
                right: 80
              }}
              y1={{
                metrics: pubSubMetrics(channelNames),
                labels: channelNames,
                type: 'line'
              }}
              y2={{
                metrics: ['pubsub_subscribed_patterns'],
                labels: ['Subscribed patterns'],
                type: 'line'
              }}
            />
          </DashboardSection>
        : null}
      <DashboardSection title="Persistence">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            min: 0,
            metrics: ['rdb_current_bgsave_time_sec', 'aof_current_rewrite_time_sec'],
            labels: ['Duration of current rdb save', 'Duration of current aof log rewrite'],
            formatter: persistenceFormater,
            type: 'line'
          }}
        />
      </DashboardSection>

      {timeframe.to == null ? <SlowLogsTable snapshotId={snapshotId} /> : null}

      {role === 'slave'
        ? <DashboardSection title="Bytes left before syncing is complete">
            <Chart
              snapshotId={snapshotId}
              timeframe={timeframe}
              margins={{
                left: 80
              }}
              y1={{
                min: 0,
                formatter: kiloBytesZeroDecimalPlaces,
                tooltipFormatter: kiloBytesTwoDecimalPlaces,
                metrics: ['master_sync_left_bytes'],
                labels: ['Bytes left before syncing is complete'],
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
        : null}

      <CustomMonitorsTable snapshot={snapshot} timeframe={timeframe} />

    </div>
  );
}
