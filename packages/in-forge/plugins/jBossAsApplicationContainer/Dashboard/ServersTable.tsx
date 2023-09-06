/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.jBossAsApplicationContainer.server'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.jBossAsApplicationContainer.connectionCount'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.snapshotId;
      },
      getMetricName(row: any) {
        return 'workerMetrics.connCountMetrics.' + row.workerName + '-' + row.key + '.connCount';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function ServersTable({ deploymentContext }: any) {
  const serverMXBeans = deploymentContext.serverMXBeans;
  const timeConfig = deploymentContext.timeConfig;
  const snapshotId = deploymentContext.snapshotId;

  const rows = serverMXBeans
    .map((server: Map<string, any>) => {
      if (typeof server === 'string' && server !== '0') {
        return {
          key: server,
          workerName: deploymentContext.key,
          timeConfig,
          snapshotId
        };
      }
      return null;
    })
    .valueSeq()
    .toArray()
    .filter(Boolean);

  return (
    <div>
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.jBossAsApplicationContainer.connectionCounts', { len: rows.length })}
        cols={cols}
        rows={rows}
        getRowDetails={getRowDetails}
      />
    </div>
  );
}

function getRowDetails(row: any) {
  return (
    <div>
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          metrics: ['workerMetrics.connCountMetrics.' + row.workerName + '-' + row.key + '.connCount'],
          labels: [t('in-forge:plugins.jBossAsApplicationContainer.connectionCount')],
          type: 'line',
          formatter: zeroDecimalPlaces
        }}
      />
    </div>
  );
}
