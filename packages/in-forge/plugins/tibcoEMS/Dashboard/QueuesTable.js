/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import getTibcoEMSQueues from 'in-forge/plugins/tibcoEMS/subscriptions/getTibcoEMSQueues';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.tibcoEMS.titleName'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.tibcoEMS.titleReceivers'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'receiverCount';
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.tibcoEMS.titleInMessages'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'inMessagesCount';
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.tibcoEMS.titleOutMessages'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'outMessagesCount';
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.tibcoEMS.labelInMessagesRate'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'inMessages';
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.tibcoEMS.labelOutMessagesRate'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'outMessages';
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default connectTo(
  props => ({
    queues: timeConfig$
      .flatMap(timeConfig => getTibcoEMSQueues({ snapshotId: props.snapshot.get('id'), timeConfig }))
      .flatMap(getSnapshots)
  }),

  function QueuesTable({ queues, timeConfig }) {
    if (queues == null || queues.length === 0) {
      return null;
    }

    const rows = queues.map(queue => {
      return {
        key: queue.get('id'),
        queueName: queue.getIn(['data', 'queueName']),
        queue,
        timeConfig
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.tibcoEMS.titleQueuesCount', { len: rows.length })}
        cols={cols}
        rows={rows}
      />
    );
  }
);
