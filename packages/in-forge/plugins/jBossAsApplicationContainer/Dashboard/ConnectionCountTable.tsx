/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

// @ts-expect-error
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { emptyMap } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import useTimeConfig from 'in-hooks/useTimeConfig';
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
        return 'serverMXBeans.' + row.key + '.connCount';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function ConnectionCountTable({ snapshot }: { snapshot: SnapshotData }) {
  const deployments = snapshot.getIn(['data', 'servers'], emptyMap);
  const timeConfig = useTimeConfig();

  if (deployments.size === 0) {
    return null;
  }

  const rows = deployments.toArray().map((key: any) => {
    const deployment = deployments.get(key);
    return {
      key: key,
      timeConfig,
      snapshotId: snapshot.get('id'),
      snapshot: snapshot,
      deployment
    };
  });

  const snapshotId = snapshot.get('id');
  return (
    <div>
      <DashboardSection title={t('in-forge:plugins.jBossAsApplicationContainer.busyWorkerThreadCount')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['busyWorkerThreadCount'],
            labels: [t('in-forge:plugins.jBossAsApplicationContainer.busyWorkerThreadCount')],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.jBossAsApplicationContainer.workerQueueSize')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['workerQueueSize'],
            labels: [t('in-forge:plugins.jBossAsApplicationContainer.workerQueueSize')],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
        />
      </DashboardSection>
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
          metrics: ['serverMXBeans.' + row.key + '.connCount'],
          labels: [t('in-forge:plugins.jBossAsApplicationContainer.connectionCount')],
          type: 'line',
          formatter: zeroDecimalPlaces
        }}
      />
    </div>
  );
}
