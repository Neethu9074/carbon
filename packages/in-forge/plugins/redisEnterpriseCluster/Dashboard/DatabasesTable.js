/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import getRedisEnterpriseDatabasesForCluster from 'in-subscription/redisEnterpriseCluster/getRedisEnterpriseDatabasesForCluster';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { bytes, number, millis } from 'in-services/formatters/number';
import { yesOrNo } from 'in-services/formatters/boolean';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.redisEnterpriseCluster.dashboard.name'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.name;
      }
    }
  },
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
    title: t('in-forge:plugins.redisEnterpriseCluster.dashboard.bigStore'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return yesOrNo(row.bigstore);
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
    title: t('in-forge:plugins.redisEnterpriseCluster.dashboard.connectedClients'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'conns';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.redisEnterpriseCluster.dashboard.latency'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'avg_latency';
      },
      getContent: millis.compact,
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
    databaseSnapshots: timeConfig$
      .flatMap(timeConfig =>
        getRedisEnterpriseDatabasesForCluster({ snapshotId: props.snapshot.get('id'), timeConfig })
      )
      .flatMap(getSnapshots)
  }),
  function DatabasesTable({ databaseSnapshots, timeConfig }) {
    if (databaseSnapshots == null || databaseSnapshots.length === 0) {
      return null;
    }

    const rows = databaseSnapshots.map(db => {
      return {
        key: db.get('id'),
        name: db.getIn(['data', 'name']),
        status: db.getIn(['data', 'status']),
        bigstore: db.getIn(['data', 'bigstore']),
        uid: db.getIn(['data', 'uid']),
        db,
        timeConfig
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.redisEnterpriseCluster.dashboard.databasesWithCount', {
          count: rows.length
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
            metrics: ['used_memory', 'mem_size_lua'],
            labels: [
              t('in-forge:plugins.redisEnterpriseCluster.dashboard.used'),
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
            metrics: ['conns'],
            labels: [t('in-forge:plugins.redisEnterpriseCluster.dashboard.connected')],
            formatter: number.compact,
            type: 'line'
          }}
          y2={{
            min: 0,
            metrics: ['total_connections_received'],
            labels: [t('in-forge:plugins.redisEnterpriseCluster.dashboard.rate')],
            formatter: number.perSecond,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.redisEnterpriseCluster.dashboard.latency')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['avg_latency'],
            labels: [t('in-forge:plugins.redisEnterpriseCluster.dashboard.latency')],
            formatter: millis.detailed,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
