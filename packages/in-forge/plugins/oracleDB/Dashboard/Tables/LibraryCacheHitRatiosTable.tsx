/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { percentage } from 'in-services/formatters/number';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { emptyMap } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

interface LibraryCacheHitRatiosTableProps {
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
    title: t('in-forge:plugins.oracleDB.bufferCache'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: Row) {
        return row.snapshotId;
      },
      getMetricName(row: Row) {
        return `stats.libraryCacheHitRatiosList.${row.key}.bufferCache`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.executeNoParse'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: Row) {
        return row.snapshotId;
      },
      getMetricName(row: Row) {
        return `stats.libraryCacheHitRatiosList.${row.key}.executeNoParse`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.memorySort'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: Row) {
        return row.snapshotId;
      },
      getMetricName(row: Row) {
        return `stats.libraryCacheHitRatiosList.${row.key}.memorySort`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.sqlAreaGetHitRate'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: Row) {
        return row.snapshotId;
      },
      getMetricName(row: Row) {
        return `stats.libraryCacheHitRatiosList.${row.key}.sqlAreaGetHitRate`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.avgLatchHitNoMiss'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: Row) {
        return row.snapshotId;
      },
      getMetricName(row: Row) {
        return `stats.libraryCacheHitRatiosList.${row.key}.avgLatchHitNoMiss`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.avgLatchHitNoSleep'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: Row) {
        return row.snapshotId;
      },
      getMetricName(row: Row) {
        return `stats.libraryCacheHitRatiosList.${row.key}.avgLatchHitNoSleep`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function LibraryCacheHitRatiosTable({ snapshot, timeConfig }: LibraryCacheHitRatiosTableProps) {
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
      cardTitle={t('in-forge:plugins.oracleDB.libraryCacheHitRatio', {
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
          formatter: percentage.detailed,
          metrics: [
            `stats.libraryCacheHitRatiosList.${row.key}.bufferCache`,
            `stats.libraryCacheHitRatiosList.${row.key}.executeNoParse`,
            `stats.libraryCacheHitRatiosList.${row.key}.memorySort`,
            `stats.libraryCacheHitRatiosList.${row.key}.sqlAreaGetHitRate`,
            `stats.libraryCacheHitRatiosList.${row.key}.avgLatchHitNoMiss`,
            `stats.libraryCacheHitRatiosList.${row.key}.avgLatchHitNoSleep`
          ],
          labels: [
            t('in-forge:plugins.oracleDB.bufferCache'),
            t('in-forge:plugins.oracleDB.executeNoParse'),
            t('in-forge:plugins.oracleDB.memorySort'),
            t('in-forge:plugins.oracleDB.sqlAreaGetHitRate'),
            t('in-forge:plugins.oracleDB.avgLatchHitNoMiss'),
            t('in-forge:plugins.oracleDB.avgLatchHitNoSleep')
          ],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
