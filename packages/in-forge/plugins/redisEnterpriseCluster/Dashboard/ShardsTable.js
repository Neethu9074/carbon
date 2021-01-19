/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import getRedisEnterpriseShardsForCluster from 'in-subscription/redisEnterpriseCluster/getRedisEnterpriseShardsForCluster';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { bytes, number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

const cols = [
  {
    title: 'UID',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.uid;
      }
    }
  },
  {
    title: 'DB UID',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.buid;
      }
    }
  },
  {
    title: 'Node UID',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.nodeuid;
      }
    }
  },
  {
    title: 'Role',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.role;
      }
    }
  },
  {
    title: 'Key Hits',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'key_hits';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Memory Used',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'used_memory';
      },
      getContent: bytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Status',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.status;
      }
    }
  }
];

export default connectTo(
  props => ({
    shardSnapshots: timeConfig$
      .flatMap(timeConfig => getRedisEnterpriseShardsForCluster({ snapshotId: props.snapshot.get('id'), timeConfig }))
      .flatMap(getSnapshots)
  }),
  function ShardsTable({ shardSnapshots, timeConfig }) {
    if (shardSnapshots == null || shardSnapshots.length === 0) {
      return null;
    }

    const rows = shardSnapshots.map(shard => {
      return {
        key: shard.get('id'),
        role: shard.get('data').get('role'),
        status: shard.get('data').get('status'),
        uid: shard.get('data').get('uid'),
        buid: shard.get('data').get('buid'),
        nodeuid: shard.get('data').get('nodeuid'),
        shard,
        timeConfig
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={`Shards (${rows.length})`}
        cols={cols}
        rows={rows}
        getRowDetails={getRowDetails}
      />
    );
  }
);

function getRowDetails(row) {
  const snapshotId = row.key;
  const timeConfig = row.timeConfig;
  return (
    <div>
      <DashboardSection title="Keys">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['key_hits', 'key_misses'],
            labels: ['Hits', 'Misses'],
            formatter: number.compact,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['expired_objects', 'evicted_objects'],
            labels: ['Expired', 'Evicted'],
            formatter: number.compact,
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
            formatter: bytes.detailed,
            tooltipFormatter: bytes.detailed,
            metrics: ['used_memory', 'mem_size_lua', 'used_memory_rss'],
            labels: ['Used', 'Lua Heap Size', 'Used RSS'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
