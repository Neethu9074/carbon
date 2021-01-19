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

const cols = [
  {
    title: 'Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.name;
      }
    }
  },
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
    title: 'Big Store',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return yesOrNo(row.bigstore);
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
    title: 'Connected Clients',
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
    title: 'Latency',
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
        cardTitle={`Databases (${rows.length})`}
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
            metrics: ['used_memory', 'mem_size_lua'],
            labels: ['Used', 'Lua Heap Size'],
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
            metrics: ['conns'],
            labels: ['Connected'],
            formatter: number.compact,
            type: 'line'
          }}
          y2={{
            min: 0,
            metrics: ['total_connections_received'],
            labels: ['Rate'],
            formatter: number.perSecond,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Latency">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['avg_latency'],
            labels: ['Latency'],
            formatter: millis.detailed,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
