/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { emptyMap } from 'in-services/fixedImmutables';
import { millis } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

interface TimeWaitedTableProps {
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}

interface Row {
  key: string;
  instanceDetails: Map<string, string | number>;
  timeConfig: TimeConfig;
  snapshotId: string;
}

const cols = [
  {
    title: t('in-forge:plugins.oracleDB.instanceID'),
    type: 'string',
    typeArgs: {
      getValue(row: Row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.userIO'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: Row) {
        return row.snapshotId;
      },
      getMetricName(row: Row) {
        return `stats.timeWaitedList.${row.key}.userIO`;
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.other'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: Row) {
        return row.snapshotId;
      },
      getMetricName(row: Row) {
        return `stats.timeWaitedList.${row.key}.other`;
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.systemIO'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: Row) {
        return row.snapshotId;
      },
      getMetricName(row: Row) {
        return `stats.timeWaitedList.${row.key}.systemIO`;
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.concurrency'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: Row) {
        return row.snapshotId;
      },
      getMetricName(row: Row) {
        return `stats.timeWaitedList.${row.key}.concurrency`;
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.scheduler'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: Row) {
        return row.snapshotId;
      },
      getMetricName(row: Row) {
        return `stats.timeWaitedList.${row.key}.scheduler`;
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.application'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: Row) {
        return row.snapshotId;
      },
      getMetricName(row: Row) {
        return `stats.timeWaitedList.${row.key}.application`;
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.commit'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: Row) {
        return row.snapshotId;
      },
      getMetricName(row: Row) {
        return `stats.timeWaitedList.${row.key}.commit`;
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.configuration'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: Row) {
        return row.snapshotId;
      },
      getMetricName(row: Row) {
        return `stats.timeWaitedList.${row.key}.configuration`;
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.administrative'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: Row) {
        return row.snapshotId;
      },
      getMetricName(row: Row) {
        return `stats.timeWaitedList.${row.key}.administrative`;
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.network'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: Row) {
        return row.snapshotId;
      },
      getMetricName(row: Row) {
        return `stats.timeWaitedList.${row.key}.network`;
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.queueing'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: Row) {
        return row.snapshotId;
      },
      getMetricName(row: Row) {
        return `stats.timeWaitedList.${row.key}.queue`;
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function TimeWaitedTable({ snapshot, timeConfig }: TimeWaitedTableProps) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'instanceDetails'], emptyMap)
    .map((instanceDetails: Object, key: string) => {
      return {
        key,
        instanceDetails,
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
      cardTitle={t('in-forge:plugins.oracleDB.timeWaitedPerSecond', {
        len: rows.length
      })}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
    />
  );
}

function getRowDetails(row: Row) {
  return (
    <div>
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: millis.detailed,
          metrics: [
            `stats.timeWaitedList.${row.key}.userIO`,
            `stats.timeWaitedList.${row.key}.other`,
            `stats.timeWaitedList.${row.key}.systemIO`,
            `stats.timeWaitedList.${row.key}.concurrency`,
            `stats.timeWaitedList.${row.key}.scheduler`,
            `stats.timeWaitedList.${row.key}.application`,
            `stats.timeWaitedList.${row.key}.commit`,
            `stats.timeWaitedList.${row.key}.configuration`,
            `stats.timeWaitedList.${row.key}.administrative`,
            `stats.timeWaitedList.${row.key}.network`,
            `stats.timeWaitedList.${row.key}.queue`
          ],
          labels: [
            t('in-forge:plugins.oracleDB.userIO'),
            t('in-forge:plugins.oracleDB.other'),
            t('in-forge:plugins.oracleDB.systemIO'),
            t('in-forge:plugins.oracleDB.concurrency'),
            t('in-forge:plugins.oracleDB.scheduler'),
            t('in-forge:plugins.oracleDB.application'),
            t('in-forge:plugins.oracleDB.commit'),
            t('in-forge:plugins.oracleDB.configuration'),
            t('in-forge:plugins.oracleDB.administrative'),
            t('in-forge:plugins.oracleDB.network'),
            t('in-forge:plugins.oracleDB.queueing')
          ],
          type: 'stackedArea'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
