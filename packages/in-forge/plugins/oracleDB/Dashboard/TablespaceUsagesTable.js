/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { bytes, percentage } from 'in-services/formatters/number';
import { emptyMap } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.oracleDB.name'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.usedSpace'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `stats.tablespaceStats.${row.key}.usedSpace`;
      },
      getContent: bytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.maxSize'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.tablespace.get('maxSize');
      },
      getContent: bytes.detailed
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.usedPercent'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `stats.tablespaceStats.${row.key}.usedPercent`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.autoextensible'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.tablespace.get('autoextensible');
      }
    }
  }
];

export default function DatasourcesTable({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'tablespaces'], emptyMap)
    .map((tablespace, key) => {
      return {
        key,
        tablespace,
        timeConfig,
        snapshotId
      };
    })
    .valueSeq()
    .toArray();

  if (rows.length === 0) {
    return null;
  }

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.oracleDB.tablespacesWithCount', {
        len: rows.length
      })}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
    />
  );
}

function getRowDetails(row) {
  return (
    <div>
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: bytes.detailed,
          metrics: ['stats.tablespaceStats.' + row.key + '.usedSpace'],
          labels: [t('in-forge:plugins.oracleDB.usedSpace')],
          type: 'area'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          max: 1,
          formatter: percentage.detailed,
          metrics: ['stats.tablespaceStats.' + row.key + '.usedPercent'],
          labels: [t('in-forge:plugins.oracleDB.usedPercent')],
          type: 'area'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
