/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { megaBytes } from 'in-services/formatters/number';
import { emptyMap } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.oracleDB.pool'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.differentPoolsInSGA.get('name');
      }
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.totalMemory'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.differentPoolsInSGA.get('totalSize');
      },
      getContent: megaBytes.detailed
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.usedMemory'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `stats.differentPoolsInSGAStats.${row.key}.used`;
      },
      getContent: megaBytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function DatasourcesTable({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'differentPoolsInSGA'], emptyMap)
    .map((differentPoolsInSGA, key) => {
      return {
        key,
        differentPoolsInSGA,
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
      cardTitle={t('in-forge:plugins.oracleDB.poolsInSGA', {
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
          formatter: megaBytes.detailed,
          metrics: [`stats.differentPoolsInSGAStats.${row.key}.used`],
          labels: [t('in-forge:plugins.oracleDB.usedMemory')],
          type: 'area'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
