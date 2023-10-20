/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { List } from 'immutable';
import React from 'react';

import { combineLatest, just } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { Result } from '@instana/types';

import getTuxedoIpcQueuesForMachine from '../subscriptions/getTuxedoIpcQueuesForMachine';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { SnapshotData, getSnapshot } from 'in-stores/snapshot/snapshot';
import { number, percentage } from 'in-services/formatters/number';
import { pendingResult } from 'in-services/fixedObjects';
import Table from 'in-sdk/components/dashboard/Table';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { success } from 'in-services/util/result';
import { t } from 'in-i18n';

const queueIdCol = {
  title: t('in-forge:plugins.tuxedoMachine.queueId'),
  type: 'string',
  typeArgs: {
    getValue(row: any) {
      return row.key.split('/')[0];
    }
  }
};

const messagesCol = {
  title: t('in-forge:plugins.tuxedoMachine.messages'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.snapshotId;
    },
    getMetricName(row: any) {
      return 'ipcQueues.' + row.key + `.qnum`;
    },
    getContent: number.compact,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};

const senderServerCol = {
  title: t('in-forge:plugins.tuxedoMachine.senderServer'),
  type: 'string',
  typeArgs: {
    getValue(row: any) {
      const senderServer = row.key.split('/')[1];
      if (senderServer) {
        return senderServer;
      } else {
        return '-';
      }
    }
  }
};

const senderPIDCol = {
  title: t('in-forge:plugins.tuxedoMachine.senderPID'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.snapshotId;
    },
    getMetricName(row: any) {
      return 'ipcQueues.' + row.key + `.senderPID`;
    },
    getContent: number.compact,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};

const receiverServerCol = {
  title: t('in-forge:plugins.tuxedoMachine.receiverServer'),
  type: 'string',
  typeArgs: {
    getValue(row: any) {
      return row.key.split('/')[2];
    }
  }
};

const receiverPIDCol = {
  title: t('in-forge:plugins.tuxedoMachine.receiverPID'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.snapshotId;
    },
    getMetricName(row: any) {
      return 'ipcQueues.' + row.key + `.receiverPID`;
    },
    getContent: number.compact,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};

const usageCol = {
  title: t('in-forge:plugins.tuxedoMachine.usage'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.snapshotId;
    },
    getMetricName(row: any) {
      return 'ipcQueues.' + row.key + `.usage`;
    },
    getContent: percentage.compact,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};

export default function QueuesTable({ snapshot }: { snapshot: SnapshotData }) {
  const timeConfig = useTimeConfig();
  const snapshotId = snapshot.get('id') as string;
  const ipcQueues = useObservable(
    getTuxedoIpcQueuesForMachine({ snapshotId, timeConfig: timeConfig }).flatMap(result =>
      result.data
        ? combineLatest(result.data.map(ipcQueue => getSnapshot(ipcQueue, timeConfig))).map(ipcQueues =>
            success(ipcQueues)
          )
        : just(pendingResult as Result<SnapshotData[]>)
    ),
    [snapshotId, timeConfig]
  );

  // eslint-disable-next-line no-console
  console.log('ipcQueues ======= ', ipcQueues);

  if (!ipcQueues?.data) {
    return null;
  }

  const ipcQueuesIds = snapshot.getIn(['data', 'ipcQueuesIds'], List());
  if (ipcQueuesIds.length === 0) {
    return null;
  }
  const rows = ipcQueuesIds.toArray().map((key: any) => {
    return {
      key: key,
      timeConfig,
      snapshotId,
      snapshot
    };
  });

  const cols = [queueIdCol, messagesCol, senderServerCol, senderPIDCol, receiverServerCol, receiverPIDCol, usageCol];
  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.tuxedoMachine.queueWithCount', { len: rows.length })}
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
          metrics: ['ipcQueues.' + row.key + `.cbytes`],
          labels: [t('in-forge:plugins.tuxedoMachine.usedBytes')],
          type: 'bar',
          formatter: number.compact
        }}
      />
      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          metrics: ['ipcQueues.' + row.key + `.qnum`],
          labels: [t('in-forge:plugins.tuxedoMachine.messages')],
          type: 'line',
          formatter: number.compact
        }}
      />
    </div>
  );
}
