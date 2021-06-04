/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number, percentage } from 'in-services/formatters/number';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.zHMCApplication.dashboard.name'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.zHMCApplication.dashboard.processorUsage'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `logicalPartition.${row.key}.processor`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.zHMCApplication.dashboard.zvm'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `logicalPartition.${row.key}.zvmPagingRate`;
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.zHMCApplication.dashboard.cp'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `logicalPartition.${row.key}.cpProcessorUsage`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.zHMCApplication.dashboard.ifl'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `logicalPartition.${row.key}.iflProcessorUsage`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.zHMCApplication.dashboard.icf'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `logicalPartition.${row.key}.icfProcessorUsage`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.zHMCApplication.dashboard.iip'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `logicalPartition.${row.key}.iipProcessorUsage`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.zHMCApplication.dashboard.cbp'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `logicalPartition.${row.key}.cbpProcessorUsage`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function lparTable({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'partitionNames'], emptyList)
    .toArray()
    .map(name => {
      return {
        key: name,
        snapshotId,
        timeConfig
      };
    });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.zHMCApplication.dashboard.logicalPartition', { len: rows.length })}
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
          metrics: ['logicalPartition.' + row.key + '.zvmPagingRate'],
          labels: [t('in-forge:plugins.zHMCApplication.dashboard.zvm')],
          type: 'line',
          formatter: number.detailed
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          metrics: [
            'logicalPartition.' + row.key + '.processor',
            'logicalPartition.' + row.key + '.cpProcessorUsage',
            'logicalPartition.' + row.key + '.iflProcessorUsage',
            'logicalPartition.' + row.key + '.icfProcessorUsage',
            'logicalPartition.' + row.key + '.iipProcessorUsage',
            'logicalPartition.' + row.key + '.cbpProcessorUsage'
          ],
          labels: [
            t('in-forge:plugins.zHMCApplication.processorUsage'),
            t('in-forge:plugins.zHMCApplication.cp'),
            t('in-forge:plugins.zHMCApplication.ifl'),
            t('in-forge:plugins.zHMCApplication.icf'),
            t('in-forge:plugins.zHMCApplication.iip'),
            t('in-forge:plugins.zHMCApplication.cbp')
          ],
          formatter: percentage.compact,
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
