/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { number, bytes, withSiPrefixThreeDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.clickhouseDatabase.dashboard.titleDatabase'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', `table_info.${row.key}.database`]);
      }
    }
  },
  {
    title: t('in-forge:plugins.clickhouseDatabase.dashboard.titleTable'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', `table_info.${row.key}.name`]);
      }
    }
  },
  {
    title: t('in-forge:plugins.clickhouseDatabase.dashboard.titleEngine'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', `table_info.${row.key}.engine`]);
      }
    }
  },
  {
    title: t('in-forge:plugins.clickhouseDatabase.dashboard.titleColumns'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `table_metric.${row.key}.columns`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.clickhouseDatabase.dashboard.titleRows'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `table_metric.${row.key}.rows`;
      },
      getContent: withSiPrefixThreeDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.clickhouseDatabase.dashboard.titleDiskUsage'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `table_metric.${row.key}.bytes_on_disk`;
      },
      getContent: bytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.clickhouseDatabase.dashboard.titlePartitions'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `table_metric.${row.key}.partitions`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.clickhouseDatabase.dashboard.titleActiveParts'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `table_metric.${row.key}.parts`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function TablesTable({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'tables'], emptyList)
    .toArray()
    .map(table => {
      return {
        key: table,
        snapshot,
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
      cardTitle={t('in-forge:plugins.clickhouseDatabase.dashboard.titleTablesCount', { tableCount: rows.length })}
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
      initialSortColumn={4}
      initialSortDirection="desc"
    />
  );
}

function getDetails(row) {
  return (
    <div>
      <DashboardSection title={t('in-forge:plugins.clickhouseDatabase.dashboard.titleData')}>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            metrics: [`table_metric.${row.key}.rows`],
            labels: [t('in-forge:plugins.clickhouseDatabase.dashboard.labelRows')],
            type: 'line',
            formatter: withSiPrefixThreeDecimalPlaces
          }}
          y2={{
            metrics: [`table_metric.${row.key}.bytes_on_disk`],
            labels: [t('in-forge:plugins.clickhouseDatabase.dashboard.labelDiskUsage')],
            type: 'line',
            formatter: bytes.detailed
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.clickhouseDatabase.dashboard.titlePartitioning')}>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            metrics: [`table_metric.${row.key}.partitions`, `table_metric.${row.key}.parts`],
            labels: [
              t('in-forge:plugins.clickhouseDatabase.dashboard.labelPartitions'),
              t('in-forge:plugins.clickhouseDatabase.dashboard.labelActiveParts')
            ],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
    </div>
  );
}
