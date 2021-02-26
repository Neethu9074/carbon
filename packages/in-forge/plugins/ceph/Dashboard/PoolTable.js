/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import {
  number,
  bytes,
  percentageTwoDecimalPlaces,
  bytesPerSecondZeroDecimalPlaces
} from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: t('in-forge:plugins.ceph.dashboard.titlePoolName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.ceph.dashboard.titleCapacity'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'pools.' + row.key + '.pct_used_pool';
      },
      getContent: percentageTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ceph.dashboard.titleObjects'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'pools.' + row.key + '.num_objects_pool';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ceph.dashboard.titleReadOPS'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'pools.' + row.key + '.read_op_per_sec_pool';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ceph.dashboard.titleWriteOPS'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'pools.' + row.key + '.write_op_per_sec_pool';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ceph.dashboard.titleRead'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'pools.' + row.key + '.read_bytes_sec_pool';
      },
      getContent: bytesPerSecondZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ceph.dashboard.titleWrite'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'pools.' + row.key + '.write_bytes_sec_pool';
      },
      getContent: bytesPerSecondZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function PoolTable({ snapshot, timeConfig }) {
  const pools = snapshot.getIn(['data', 'poolsList'], emptyList);
  if (pools.size === 0) {
    return null;
  }
  const rows = pools
    .map(pool => {
      return {
        key: pool,
        timeConfig,
        snapshotId: snapshot.get('id')
      };
    })
    .toArray();

  return (
    <Table withoutPadding cardTitle={`Pools (${rows.length})`} cols={cols} rows={rows} getRowDetails={getDetails} />
  );
}

function getDetails(row) {
  const id = row.key;
  return (
    <div>
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          max: 1,
          metrics: ['pools.' + id + '.pct_used_pool'],
          labels: [t('in-forge:plugins.ceph.dashboard.titleCapacity')],
          type: 'line',
          formatter: percentageTwoDecimalPlaces
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          metrics: ['pools.' + id + '.num_objects_pool'],
          labels: [t('in-forge:plugins.ceph.dashboard.titleObjects')],
          type: 'line',
          formatter: number.compact
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          metrics: ['pools.' + id + '.read_bytes_pool'],
          labels: [t('in-forge:plugins.ceph.dashboard.titleRead')],
          type: 'line',
          formatter: bytes.compact
        }}
        y2={{
          min: 0,
          metrics: ['pools.' + id + '.write_bytes_pool'],
          labels: [t('in-forge:plugins.ceph.dashboard.titleWrite')],
          type: 'line',
          formatter: bytes.compact
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Columize>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            metrics: ['pools.' + id + '.read_bytes_sec_pool'],
            labels: [t('in-forge:plugins.ceph.dashboard.titleRead')],
            type: 'line',
            formatter: bytesPerSecondZeroDecimalPlaces
          }}
          y2={{
            min: 0,
            metrics: ['pools.' + id + '.write_bytes_sec_pool'],
            labels: [t('in-forge:plugins.ceph.dashboard.titleWrite')],
            type: 'line',
            formatter: bytesPerSecondZeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            metrics: ['pools.' + id + '.read_op_per_sec_pool'],
            labels: [t('in-forge:plugins.ceph.dashboard.titleReadOPS')],
            type: 'line',
            formatter: number.compact
          }}
          y2={{
            min: 0,
            metrics: ['pools.' + id + '.write_op_per_sec_pool'],
            labels: [t('in-forge:plugins.ceph.dashboard.titleWriteOPS')],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </Columize>
    </div>
  );
}
