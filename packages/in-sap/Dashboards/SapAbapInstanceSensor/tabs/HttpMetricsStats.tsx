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
import { number, seconds } from 'in-services/formatters/number';
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
    title: t('in-sap:dashboards.account'),
    type: 'string',
    typeArgs: {
      getValue(row: HttpRow) {
        return row.http.get('account');
      }
    }
  },
  {
    title: t('in-sap:dashboards.mandt'),
    type: 'string',
    typeArgs: {
      getValue(row: HttpRow) {
        return row.http.get('mandt');
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
  const httpData = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'httpMetricsStats'), [snapshotId]);
  if (!httpData) {
    return null;
  }
  const httpMetricStat = (httpData as SnapshotData).get('raw_payload', []);
  const rows: HttpRow[] = httpMetricStat
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
    });

  function getDetails(row: HttpRow) {
    return (
      <div>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: seconds.detailed,
            metrics: [
              `httpMetricsStats.${row.key}.callTime`,
              `httpMetricsStats.${row.key}.executionTime`,
              `httpMetricsStats.${row.key}.dataSendTime`,
              `httpMetricsStats.${row.key}.dataReceiveTime`,
              `httpMetricsStats.${row.key}.logonTime`
            ],
            labels: [
              t('in-sap:dashboards.callTime'),
              t('in-sap:dashboards.executionTime'),
              t('in-sap:dashboards.dataSendTime'),
              t('in-sap:dashboards.dataReceiveTime'),
              t('in-sap:dashboards.logonTime')
            ],
            type: 'line'
          }}
          y2={{
            min: 0,
            metrics: [`httpMetricsStats.${row.key}.counter`],
            labels: [t('in-sap:dashboards.counter')],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </div>
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
