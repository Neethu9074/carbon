/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { number } from 'in-services/formatters/number';
import { emptyMap } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const snapshot_Col1 = {
  title: t('in-forge:plugins.ibmMqQueue.dashboard.intervalStartDateTime'),
  type: 'string',
  typeArgs: {
    getValue(row) {
      return row.statistics.get('intervalStartDateTime');
    }
  }
};
const snapshot_Col2 = {
  title: t('in-forge:plugins.ibmMqQueue.dashboard.intervalEndDateTime'),
  type: 'string',
  typeArgs: {
    getValue(row) {
      return row.statistics.get('intervalEndDateTime');
    }
  }
};
const metric_Col1 = {
  title: t('in-forge:plugins.ibmMqQueue.dashboard.persistentPutBytes'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row) {
      return row.snapshotId;
    },
    getMetricName(row) {
      return 'statistics.' + row.key + '.persistentPutBytes';
    },
    getContent: number.compact,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};
const metric_Col2 = {
  title: t('in-forge:plugins.ibmMqQueue.dashboard.nonPersistentPutBytes'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row) {
      return row.snapshotId;
    },
    getMetricName(row) {
      return 'statistics.' + row.key + '.nonPersistentPutBytes';
    },
    getContent: number.compact,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};
const metric_Col3 = {
  title: t('in-forge:plugins.ibmMqQueue.dashboard.putFailCount'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row) {
      return row.snapshotId;
    },
    getMetricName(row) {
      return 'statistics.' + row.key + '.putFailCount';
    },
    getContent: number.compact,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};
const metric_Col4 = {
  title: t('in-forge:plugins.ibmMqQueue.dashboard.put1FailCount'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row) {
      return row.snapshotId;
    },
    getMetricName(row) {
      return 'statistics.' + row.key + '.put1FailCount';
    },
    getContent: number.compact,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};
const metric_Col5 = {
  title: t('in-forge:plugins.ibmMqQueue.dashboard.persistentGetBytes'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row) {
      return row.snapshotId;
    },
    getMetricName(row) {
      return 'statistics.' + row.key + '.persistentGetBytes';
    },
    getContent: number.compact,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};
const metric_Col6 = {
  title: t('in-forge:plugins.ibmMqQueue.dashboard.nonPersistentGetBytes'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row) {
      return row.snapshotId;
    },
    getMetricName(row) {
      return 'statistics.' + row.key + '.nonPersistentGetBytes';
    },
    getContent: number.compact,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};
const metric_Col7 = {
  title: t('in-forge:plugins.ibmMqQueue.dashboard.getFailCount'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row) {
      return row.snapshotId;
    },
    getMetricName(row) {
      return 'statistics.' + row.key + '.getFailCount';
    },
    getContent: number.compact,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};
const metric_Col8 = {
  title: t('in-forge:plugins.ibmMqQueue.dashboard.expiredMsgCount'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row) {
      return row.snapshotId;
    },
    getMetricName(row) {
      return 'statistics.' + row.key + '.expiredMsgCount';
    },
    getContent: number.compact,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};
export default function StatisticsTable({ snapshot, snapshotId, timeConfig }) {
  const rows = snapshot
    .getIn(['data', 'statistics'], emptyMap)
    .map((statistics, name) => {
      return {
        key: name,
        statistics,
        timeConfig,
        snapshotId
      };
    })
    .valueSeq()
    .toArray();

  if (rows.length === 0) {
    return null;
  }

  const cols = [
    snapshot_Col1,
    snapshot_Col2,
    metric_Col1,
    metric_Col2,
    metric_Col5,
    metric_Col6,
    metric_Col8,
    metric_Col3,
    metric_Col4,
    metric_Col7
  ];

  return (
    <Table
      cardTitle={t('in-forge:plugins.ibmMqQueue.statisticsWithCount', { count: rows.length })}
      withoutPadding
      cols={cols}
      rows={rows}
    />
  );
}
