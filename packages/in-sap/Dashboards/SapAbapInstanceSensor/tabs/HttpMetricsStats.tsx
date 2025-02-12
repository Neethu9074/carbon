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
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number, seconds } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

interface HttpRow {
  key: string;
  snapshotId: string;
  http: Map<string, object>;
}

interface HttpMetricProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-sap:dashboards.client'),
    type: 'string',
    typeArgs: {
      getValue(row: HttpRow) {
        return row.http.get('mandt');
      }
    }
  },
  {
    title: t('in-sap:dashboards.userName'),
    type: 'string',
    typeArgs: {
      getValue(row: HttpRow) {
        return row.http.get('account');
      }
    }
  },
  {
    title: t('in-sap:dashboards.protocol'),
    type: 'string',
    typeArgs: {
      getValue(row: HttpRow) {
        return row.http.get('protocol');
      }
    }
  },
  {
    title: t('in-sap:dashboards.taskType'),
    type: 'string',
    typeArgs: {
      getValue(row: HttpRow) {
        return row.http.get('taskType');
      }
    }
  },
  {
    title: t('in-sap:dashboards.entryID'),
    type: 'string',
    typeArgs: {
      getValue(row: HttpRow) {
        return row.http.get('entryID');
      }
    }
  },
  {
    title: t('in-sap:dashboards.host'),
    type: 'string',
    typeArgs: {
      getValue(row: HttpRow) {
        return row.http.get('host');
      }
    }
  },
  {
    title: t('in-sap:dashboards.port'),
    type: 'string',
    typeArgs: {
      getValue(row: HttpRow) {
        return row.http.get('port');
      }
    }
  }
];

export default function HttpMetricsStats({ snapshotId, timeConfig }: HttpMetricProps) {
  const httpData = useObservable(
    () => getRawPayloadWithTimestamp(snapshotId, 'httpMetricsStats', timeConfig),
    [snapshotId, timeConfig]
  );
  const httpMetricStat = httpData ? (httpData as SnapshotData).get('raw_payload', []) : null;
  const rows: HttpRow[] = httpMetricStat
    ? httpMetricStat
        .keySeq()
        .toArray()
        .map((key: string) => {
          const http = httpMetricStat.get(key);
          return {
            key,
            snapshotId,
            timeConfig,
            http
          };
        })
        .filter((row: HttpRow) => {
          const userValue = row.http.get('account');
          return typeof userValue === 'string' && userValue !== 'UNKNOWN';
        })
    : [];

  function getDetails(row: HttpRow) {
    return (
      <Columize>
        <DashboardSection>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: seconds.detailed,
              metrics: [`httpMetricsStats.${row.key}.callTime`, `httpMetricsStats.${row.key}.executionTime`],
              labels: [t('in-sap:dashboards.callTime'), t('in-sap:dashboards.executionTime')],
              type: 'line'
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
              formatter: seconds.detailed,
              metrics: [`httpMetricsStats.${row.key}.dataSendTime`, `httpMetricsStats.${row.key}.dataReceiveTime`],
              labels: [t('in-sap:dashboards.dataSendTime'), t('in-sap:dashboards.dataReceiveTime')],
              type: 'line'
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
              formatter: number.compact,
              metrics: [`httpMetricsStats.${row.key}.counter`],
              labels: [t('in-sap:dashboards.counter')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
    );
  }
  return (
    <Table
      withoutPadding
      cardTitle={t('in-sap:dashboards.httpMetricsStats')}
      cols={cols}
      rows={rows}
      initialSortColumn={0}
      initialSortDirection="asc"
      getRowDetails={getDetails}
    />
  );
}
