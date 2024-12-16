/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
// @ts-expect-error needs TS migration
import { SnapshotData, getRawPayloadWithTimestamp } from 'in-stores/snapshot';
// @ts-expect-error needs TS migration
import { formatSql } from 'in-forge/tracing/jdbc/sql';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import Code from 'in-components/Code';
import { t } from 'in-i18n';

interface GatewayErrorStatsRow {
  key: string;
  snapshotId: string;
  gatewayErrorStats: Map<string, object>;
}

interface GatewayErrorStatsProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-sap:dashboards.errorCount'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: GatewayErrorStatsRow) {
        return row.snapshotId;
      },
      getMetricName(row: GatewayErrorStatsRow) {
        return `gatewayErrorLogs.${row.key}.errorCount`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-sap:dashboards.userName'),
    type: 'string',
    typeArgs: {
      getValue(row: GatewayErrorStatsRow) {
        return row.gatewayErrorStats.get('userName');
      }
    }
  },
  {
    title: t('in-sap:dashboards.remoteAddress'),
    type: 'string',
    typeArgs: {
      getValue(row: GatewayErrorStatsRow) {
        return row.gatewayErrorStats.get('remoteAddress');
      }
    }
  },
  {
    title: t('in-sap:dashboards.errorText'),
    type: 'string',
    typeArgs: {
      getValue(row: GatewayErrorStatsRow) {
        return row.gatewayErrorStats.get('errorText');
      }
    }
  }
];

export default function FrontEndErrorLogs({ snapshotId, timeConfig }: GatewayErrorStatsProps) {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'gatewayErrorLogs'), [snapshotId]);
  if (!data) {
    return null;
  }
  const gatewayErrorStat = (data as SnapshotData).get('raw_payload', []);
  const rows: GatewayErrorStatsRow[] = gatewayErrorStat
    .keySeq()
    .toArray()
    .map((key: string) => {
      const gatewayErrorStats = gatewayErrorStat.get(key);

      return {
        key,
        snapshotId,
        timeConfig,
        gatewayErrorStats
      };
    });

  function getDetails(row: GatewayErrorStatsRow) {
    return (
      <div>
        <Columize>
          <DashboardSection>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: [`gatewayErrorLogs.${row.key}.errorCount`],
                labels: [t('in-sap:dashboards.errorCount')],
                type: 'line',
                formatter: number.compact
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
          <DashboardSection>
            <label>Transaction ID : </label>
            <Code
              code={formatSql(
                row.gatewayErrorStats.get('transactionId') == null ? '' : row.gatewayErrorStats.get('transactionId')
              )}
              lang="bash"
              softWrap
            />
            <label>Error Package : </label>
            <Code
              code={formatSql(
                row.gatewayErrorStats.get('errorPackage') == null ? '' : row.gatewayErrorStats.get('errorPackage')
              )}
              lang="sql"
              softWrap
            />
            <label>Source Program : </label>
            <Code
              code={formatSql(
                row.gatewayErrorStats.get('sourceProgram') == null ? '' : row.gatewayErrorStats.get('sourceProgram')
              )}
              lang="sql"
              softWrap
            />
          </DashboardSection>
        </Columize>
      </div>
    );
  }
  return (
    <Table
      withoutPadding
      cardTitle={t('in-sap:dashboards.gatewayFrontEndErrorLogs')}
      cols={cols}
      rows={rows}
      initialSortColumn={0}
      initialSortDirection="desc"
      getRowDetails={getDetails}
    />
  );
}
