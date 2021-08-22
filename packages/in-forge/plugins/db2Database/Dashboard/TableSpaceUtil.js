/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { percentagePlain, kiloBytes } from 'in-services/formatters/number';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.db2Database.tableSpaceName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.totalSize'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `tablespaceutil.${row.key}.totalSize`;
      },
      getContent: kiloBytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.usedSpace'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `tablespaceutil.${row.key}.usedSpace`;
      },
      getContent: kiloBytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.freeSpace'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `tablespaceutil.${row.key}.freeSpace`;
      },
      getContent: kiloBytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.spaceUtilPercent'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `tablespaceutil.${row.key}.spaceUtilPercent`;
      },
      getContent: percentagePlain.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function TableSpaceUtil({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'tableSpaceNames'], emptyList)
    .toArray()
    .map(name => {
      return {
        key: name,
        snapshotId,
        timeConfig
      };
    });

  if (rows.length === 0) {
    return null;
  }

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.db2Database.dashboard.tableSpaceUtil', { len: rows.length })}
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
    />
  );
}

function getDetails(row) {
  return (
    <div>
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          formatter: kiloBytes.detailed,
          metrics: [
            'tablespaceutil.' + row.key + '.totalSize',
            'tablespaceutil.' + row.key + '.usedSpace',
            'tablespaceutil.' + row.key + '.freeSpace'
          ],
          labels: [
            t('in-forge:plugins.db2Database.totalSize'),
            t('in-forge:plugins.db2Database.usedSpace'),
            t('in-forge:plugins.db2Database.freeSpace')
          ],
          type: 'line'
        }}
        y2={{
          min: 0,
          formatter: percentagePlain.detailed,
          metrics: ['tablespaceutil.' + row.key + '.spaceUtilPercent'],
          labels: [t('in-forge:plugins.db2Database.spaceUtilPercent')],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
