/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number, percentage } from 'in-services/formatters/number';
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
    title: t('in-forge:plugins.oracleDB.processMaxUtilization'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: Row) {
        return row.snapshotId;
      },
      getMetricName(row: Row) {
        return `stats.processUtilizationStats.${row.key}.maxUtilization`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.processCurrentUtilization'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: Row) {
        return row.snapshotId;
      },
      getMetricName(row: Row) {
        return `stats.processUtilizationStats.${row.key}.currentUtilization`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.processInitialAllocation'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: Row) {
        return row.snapshotId;
      },
      getMetricName(row: Row) {
        return `stats.processUtilizationStats.${row.key}.initialAllocation`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.processLimitValue'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: Row) {
        return row.snapshotId;
      },
      getMetricName(row: Row) {
        return `stats.processUtilizationStats.${row.key}.limitValue`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.processLimit'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: Row) {
        return row.snapshotId;
      },
      getMetricName(row: Row) {
        return `stats.processUtilizationStats.${row.key}.processLimit`;
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
      cardTitle={t('in-forge:plugins.oracleDB.processDetails', {
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
        <DashboardSection title={t('in-forge:plugins.oracleDB.processUtilization')}>
          <Chart
            snapshotId={row.snapshotId}
            timeConfig={row.timeConfig}
            y1={{
              formatter: number.compact,
              metrics: [
                `stats.processUtilizationStats.${row.key}.maxUtilization`,
                `stats.processUtilizationStats.${row.key}.currentUtilization`,
                `stats.processUtilizationStats.${row.key}.initialAllocation`,
                `stats.processUtilizationStats.${row.key}.limitValue`
              ],
              labels: [
                t('in-forge:plugins.oracleDB.processMaxUtilization'),
                t('in-forge:plugins.oracleDB.processCurrentUtilization'),
                t('in-forge:plugins.oracleDB.processInitialAllocation'),
                t('in-forge:plugins.oracleDB.processLimitValue')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.oracleDB.processLimitUsage')}>
          <Chart
            snapshotId={row.snapshotId}
            timeConfig={row.timeConfig}
            y1={{
              formatter: percentage.detailed,
              metrics: [`stats.processUtilizationStats.${row.key}.processLimit`],
              labels: [t('in-forge:plugins.oracleDB.processLimit')],
              type: 'area'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
    </div>
  );
}
