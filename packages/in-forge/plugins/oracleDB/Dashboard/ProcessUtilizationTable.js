/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import React from 'react';

// import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import { number } from 'in-services/formatters/number';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.activeMQ.queueSize'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'status.sqlExecuteCount';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.activeMQ.queueSize'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'status.sqlExecuteCount';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default connectTo(function ProcessUtilizationTable({ snapshot, timeConfig }) {
  const rows = Range(0, 3)
    .toArray()
    .map(storeNum => {
      return {
        key: String(storeNum),
        storeNum,
        timeConfig,
        snapshotId: snapshot.get('id')
      };
    });

  return (
    <Table withoutPadding cardTitle={t('in-forge:plugins.activeMQ.deadLetterQueuesNumber')} cols={cols} rows={rows} />
  );
});
