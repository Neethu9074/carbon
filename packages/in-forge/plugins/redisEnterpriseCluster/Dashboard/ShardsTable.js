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
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.redisEnterpriseCluster.dashboard.uid'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.uid;
      }
    }
  },
  {
    title: t('in-forge:plugins.redisEnterpriseCluster.dashboard.dbUid'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.buid;
      }
    }
  },
  {
    title: t('in-forge:plugins.redisEnterpriseCluster.dashboard.nodeUid'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.nodeuid;
      }
    }
  },
  {
    title: t('in-forge:plugins.redisEnterpriseCluster.dashboard.role'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.role;
      }
    }
  },
  {
    title: t('in-forge:plugins.redisEnterpriseCluster.dashboard.keyHits'),
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
    title: t('in-forge:plugins.redisEnterpriseCluster.dashboard.memoryUsed'),
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
    title: t('in-forge:plugins.redisEnterpriseCluster.dashboard.status'),
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
        cardTitle={t('in-forge:plugins.redisEnterpriseCluster.dashboard.shardsWithCount', {
          len: rows.length
        })}
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
            formatter: bytes.detailed,
            tooltipFormatter: bytes.detailed,
            metrics: ['used_memory', 'mem_size_lua', 'used_memory_rss'],
            labels: [
              t('in-forge:plugins.redisEnterpriseCluster.dashboard.used'),
              t('in-forge:plugins.redisEnterpriseCluster.dashboard.luaHeapSize'),
              t('in-forge:plugins.redisEnterpriseCluster.dashboard.usedRss')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
