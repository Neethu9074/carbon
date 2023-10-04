/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { micros, percentage, hitRateTwoDecimalPlaces } from 'in-services/formatters/number';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { emptyMap } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

interface DatasourcesTableProps {
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
    title: t('in-forge:plugins.oracleDB.db'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: Row) {
        return row.snapshotId;
      },
      getMetricName(row: Row) {
        return `stats.systemTimeModelStats.${row.key}.dbTime`;
      },
      getContent: micros.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.dbCpu'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: Row) {
        return row.snapshotId;
      },
      getMetricName(row: Row) {
        return `stats.systemTimeModelStats.${row.key}.cpuTime`;
      },
      getContent: micros.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.sqlExecute'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: Row) {
        return row.snapshotId;
      },
      getMetricName(row: Row) {
        return `stats.systemTimeModelStats.${row.key}.sqlExecuteTime`;
      },
      getContent: micros.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.parse'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: Row) {
        return row.snapshotId;
      },
      getMetricName(row: Row) {
        return `stats.systemTimeModelStats.${row.key}.parseTime`;
      },
      getContent: micros.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.ratio'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: Row) {
        return row.snapshotId;
      },
      getMetricName(row: Row) {
        return `stats.systemTimeModelStats.${row.key}.cpuTimeDbTimeRatio`;
      },
      getContent: percentage.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function DatasourcesTable({ snapshot, timeConfig }: DatasourcesTableProps) {
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
      cardTitle={t('in-forge:plugins.oracleDB.dbDetails', {
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
      <Columize>
        <DashboardSection title={t('in-forge:plugins.oracleDB.dbTimePerSecond')}>
          <Chart
            snapshotId={row.snapshotId}
            timeConfig={row.timeConfig}
            y1={{
              formatter: micros.detailed,
              metrics: [
                `stats.systemTimeModelStats.${row.key}.dbTime`,
                `stats.systemTimeModelStats.${row.key}.cpuTime`,
                `stats.systemTimeModelStats.${row.key}.sqlExecuteTime`,
                `stats.systemTimeModelStats.${row.key}.parseTime`
              ],
              labels: [
                t('in-forge:plugins.oracleDB.db'),
                t('in-forge:plugins.oracleDB.dbCpu'),
                t('in-forge:plugins.oracleDB.sqlExecute'),
                t('in-forge:plugins.oracleDB.parse')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.oracleDB.dbSlashCpuTime')}>
          <Chart
            snapshotId={row.snapshotId}
            timeConfig={row.timeConfig}
            y1={{
              formatter: hitRateTwoDecimalPlaces,
              metrics: [`stats.systemTimeModelStats.${row.key}.cpuTimeDbTimeRatio`],
              labels: [t('in-forge:plugins.oracleDB.ratio')],
              type: 'area'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
    </div>
  );
}
