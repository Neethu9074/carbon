/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
// @ts-expect-error needs TS migration
import { SnapshotData, getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

interface DatabaseHitListRow {
  key: string;
  snapshotId: string;
  dataStats: Map<string, object>;
}

interface DatabaseHitListProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-sap:dashboards.account'),
    type: 'string',
    typeArgs: {
      getValue(row: DatabaseHitListRow) {
        return row.dataStats.get('account');
      }
    }
  },
  {
    title: t('in-sap:dashboards.client'),
    type: 'string',
    typeArgs: {
      getValue(row: DatabaseHitListRow) {
        return row.dataStats.get('client');
      }
    }
  },
  {
    title: t('in-sap:dashboards.report'),
    type: 'string',
    typeArgs: {
      getValue(row: DatabaseHitListRow) {
        return row.dataStats.get('report');
      }
    }
  },
  {
    title: t('in-sap:dashboards.endDate'),
    type: 'string',
    typeArgs: {
      getValue(row: DatabaseHitListRow) {
        return row.dataStats.get('endDate');
      }
    }
  }
];

export default function DatabaseHitList({ snapshotId, timeConfig }: DatabaseHitListProps) {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'databaseStats'), [snapshotId]);
  if (!data) {
    return null;
  }
  const dataStat = (data as SnapshotData).get('raw_payload', []);
  const rows: DatabaseHitListRow[] = dataStat
    .keySeq()
    .toArray()
    .map((key: string) => {
      const dataStats = dataStat.get(key);
      return {
        key,
        snapshotId,
        timeConfig,
        dataStats
      };
    });

  function getDetails(row: DatabaseHitListRow) {
    return (
      <div>
        <Columize>
          <DashboardSection title={t('in-sap:dashboards.databaseStats')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: [
                  `databaseStats.${row.key}.dbRequestTime`,
                  `databaseStats.${row.key}.totalDbRequests`,
                  `databaseStats.${row.key}.totalDbCalls`
                ],
                labels: [
                  t('in-sap:dashboards.dbRequestTime'),
                  t('in-sap:dashboards.totalDbRequests'),
                  t('in-sap:dashboards.totalDbCalls')
                ],
                type: 'line',
                formatter: number.detailed
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
      cardTitle={t('in-sap:dashboards.databaseHitList')}
      cols={cols}
      rows={rows}
      initialSortColumn={0}
      initialSortDirection="asc"
      getRowDetails={getDetails}
    />
  );
}
