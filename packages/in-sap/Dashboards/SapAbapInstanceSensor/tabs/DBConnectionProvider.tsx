/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

//@ts-nocheck
import React from 'react';

import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
// @ts-expect-error needs TS migration
import { SnapshotData, getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { millis, number } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

interface DbConnectRow {
  key: string;
  snapshotId: string;
  dbStats: Map<string, object>;
}
interface DbConnectProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-sap:dashboards.taskType'),
    type: 'string',
    typeArgs: {
      getValue(row: DbConnectRow) {
        return row.dbStats.get('taskType');
      }
    }
  },
  {
    title: t('in-sap:dashboards.connectionName'),
    type: 'string',
    typeArgs: {
      getValue(row: DbConnectRow) {
        return row.dbStats.get('connectionName');
      }
    }
  },
  {
    title: t('in-sap:dashboards.entryID'),
    type: 'string',
    typeArgs: {
      getValue(row: DbConnectRow) {
        return row.dbStats.get('entryID');
      }
    }
  },
  {
    title: t('in-sap:dashboards.dbTime'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: DbConnectRow) {
        return row.snapshotId;
      },
      getMetricName(row: DbConnectRow) {
        return `dbConnectionList.${row.key}.dbTime`;
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-sap:dashboards.calls'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: DbConnectRow) {
        return row.snapshotId;
      },
      getMetricName(row: DbConnectRow) {
        return `dbConnectionList.${row.key}.totalCalls`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function DBConnectionProvider({ snapshotId, timeConfig }: DbConnectProps) {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'dbConnectionList'), [snapshotId]);
  if (!data) {
    return null;
  }
  const dbStat = (data as SnapshotData).get('raw_payload', []);
  const rows: DbConnectRow[] = dbStat
    .keySeq()
    .toArray()
    .map((key: string) => {
      const dbStats = dbStat.get(key);

      return {
        key,
        snapshotId,
        timeConfig,
        dbStats
      };
    });

  function getDetails(row: DbConnectRow) {
    return (
      <div>
        <Columize>
          <DashboardSection>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: [`dbConnectionList.${row.key}.dbTime`],
                labels: [t('in-sap:dashboards.dbTime')],
                type: 'line',
                formatter: millis.detailed
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
          <DashboardSection>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: [`dbConnectionList.${row.key}.totalCalls`],
                labels: [t('in-sap:dashboards.calls')],
                type: 'line',
                formatter: number.compact
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        </Columize>
      </div>
    );
  }
  return (
    <Table
      withoutPadding
      cardTitle={t('in-sap:dashboards.databaseConnection')}
      cols={cols}
      rows={rows}
      initialSortColumn={0}
      initialSortDirection="asc"
      getRowDetails={getDetails}
    />
  );
}
