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

interface GatewayBackendErrorStatsRow {
  key: string;
  snapshotId: string;
  gatewayErrorStats: Map<string, object>;
}

interface GatewayBackendErrorStatsProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-sap:dashboards.errorCount'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: GatewayBackendErrorStatsRow) {
        return row.snapshotId;
      },
      getMetricName(row: GatewayBackendErrorStatsRow) {
        return `gatewayBackendErrorLogs.${row.key}.errorCount`;
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
      getValue(row: GatewayBackendErrorStatsRow) {
        return row.gatewayErrorStats.get('userName');
      }
    }
  },
  {
    title: t('in-sap:dashboards.remoteAddress'),
    type: 'string',
    typeArgs: {
      getValue(row: GatewayBackendErrorStatsRow) {
        return row.gatewayErrorStats.get('remoteAddress');
      }
    }
  },
  {
    title: t('in-sap:dashboards.errorText'),
    type: 'string',
    typeArgs: {
      getValue(row: GatewayBackendErrorStatsRow) {
        return row.gatewayErrorStats.get('errorText');
      }
    }
  }
];

export default function BackEndErrorLogs({ snapshotId, timeConfig }: GatewayBackendErrorStatsProps) {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'gatewayBackendErrorLogs'), [snapshotId]);
  if (!data) {
    return null;
  }
  const gatewayErrorStat = (data as SnapshotData).get('raw_payload', []);
  const rows: GatewayBackendErrorStatsRow[] = gatewayErrorStat
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

  function getDetails(row: GatewayBackendErrorStatsRow) {
    return (
      <div>
        <Columize>
          <DashboardSection>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: [`gatewayBackendErrorLogs.${row.key}.errorCount`],
                labels: [t('in-sap:dashboards.errorCount')],
                type: 'line',
                formatter: number.compact
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
          <DashboardSection>
            <label>{t('in-sap:dashboards.transactionId')} : </label>
            <Code
              code={formatSql(
                row.gatewayErrorStats.get('transactionId') == null ? '' : row.gatewayErrorStats.get('transactionId')
              )}
              lang="sql"
              softWrap
            />
            <label>{t('in-sap:dashboards.errorPackage')} : </label>
            <Code
              code={formatSql(
                row.gatewayErrorStats.get('errorPackage') == null ? '' : row.gatewayErrorStats.get('errorPackage')
              )}
              lang="sql"
              softWrap
            />
            <label>{t('in-sap:dashboards.sourceProgram')} : </label>
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
      cardTitle={t('in-sap:dashboards.gatewayBackendEndErrorLogs')}
      cols={cols}
      rows={rows}
      initialSortColumn={0}
      initialSortDirection="desc"
      getRowDetails={getDetails}
    />
  );
}
