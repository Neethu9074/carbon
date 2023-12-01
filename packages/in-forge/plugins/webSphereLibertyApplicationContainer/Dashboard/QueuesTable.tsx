/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Map } from 'immutable';
import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { emptyList } from 'in-services/fixedImmutables';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

const queueNameCol = {
  title: t('in-forge:plugins.webSphereLibertyAppContainer.titleQueueName'),
  type: 'string',
  typeArgs: {
    getValue(row: any) {
      return row.key;
    }
  }
};

const stateCol = {
  title: t('in-forge:plugins.webSphereLibertyAppContainer.titleQueueState'),
  type: 'string',
  typeArgs: {
    getValue(row: any) {
      return row.state;
    }
  }
};

const depthCol = {
  title: t('in-forge:plugins.webSphereLibertyAppContainer.titleDepth'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.snapshotId;
    },
    getMetricName(row: any) {
      return 'queues.' + row.key + `.depth`;
    },
    getContent: number.compact,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};

export default function QueuesTable({ snapshot }: { snapshot: SnapshotData }) {
  const timeConfig = useTimeConfig();
  const snapshotId = snapshot.get('id') as string;
  const queueNames = snapshot.getIn(['data', 'queueNames'], emptyList);
  if (queueNames.size === 0) {
    return null;
  }

  const rows = queueNames
    .map((queue: Map<string, any>, name: string) => {
      return {
        key: name,
        state: queue.get('state'),
        timeConfig,
        snapshotId
      };
    })
    .valueSeq()
    .toArray()
    .filter(Boolean);

  if (rows.length === 0) {
    return null;
  }

  const cols = [queueNameCol, stateCol, depthCol];
  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.webSphereLibertyAppContainer.titleQueuesCount', { len: rows.length })}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
    />
  );
}

function getRowDetails(row: any) {
  const snapshotId = row.snapshotId;
  const timeConfig = row.timeConfig;

  return (
    <div>
      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          metrics: ['queues.' + row.key + `.depth`],
          labels: [t('in-forge:plugins.webSphereLibertyAppContainer.titleDepth')],
          type: 'line',
          formatter: number.compact
        }}
      />
    </div>
  );
}
