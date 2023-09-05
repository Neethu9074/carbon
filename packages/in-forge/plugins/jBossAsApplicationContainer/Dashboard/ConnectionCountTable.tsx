/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import ServersTable from 'in-forge/plugins/jBossAsApplicationContainer/Dashboard/ServersTable';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
// @ts-expect-error
import Columize from 'in-sdk/components/dashboard/Columize';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { emptyMap } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.jBossAsApplicationContainer.workerName'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        return row.key;
      }
    }
  }
];

export default function ConnectionCountTable({ snapshot }: { snapshot: SnapshotData }) {
  const deployments = snapshot.getIn(['data'], emptyMap);
  const timeConfig = useTimeConfig();
  const snapshotId = snapshot.get('id') as string;

  if (deployments.size === 0) {
    return null;
  }

  const rows = snapshot
    .getIn(['data', 'servers'], emptyMap)
    .map((serverMXBeans: Map<string, any>, name: string) => {
      return {
        key: name,
        serverMXBeans,
        timeConfig,
        snapshotId
      };
    })
    .valueSeq()
    .toArray()
    .filter(Boolean);

  return (
    <div>
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.jBossAsApplicationContainer.workers', { len: rows.length })}
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
      <Columize>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            metrics: ['metrics.workerThreadMetrics.' + row.key + '.busyWorkerThreadCount'],
            labels: [t('in-forge:plugins.jBossAsApplicationContainer.busyWorkerThreadCount')],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
        />
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            metrics: ['metrics.workerThreadMetrics.' + row.key + '.workerQueueSize'],
            labels: [t('in-forge:plugins.jBossAsApplicationContainer.workerQueueSize')],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
        />
      </Columize>
      <ServersTable deploymentContext={row} />
    </div>
  );
}
