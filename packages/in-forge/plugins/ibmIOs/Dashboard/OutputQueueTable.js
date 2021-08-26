/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { emptyMap } from 'in-services/fixedImmutables';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const outputQueueStatusFormatter = status => {
  switch (status) {
    case 0:
      return 'RELEASED';
    case 1:
      return 'HELD';
    default:
      return '-';
  }
};

const writerJobStatusFormatter = status => {
  switch (status) {
    case 0:
      return 'END';
    case 1:
      return 'HELD';
    case 2:
      return 'JOBQ';
    case 3:
      return 'MSGW';
    case 4:
      return 'STR';
    default:
      return '-';
  }
};

const cols = [
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.outputQueues.outputQueueName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.outputQueueStringData.get('queueName');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.outputQueues.outputLibraryName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.outputQueueStringData.get('libraryName');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.outputQueues.status'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `outputQueueMetrics.${row.key}.status`;
      },
      getContent: outputQueueStatusFormatter,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.outputQueues.fileCount'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `outputQueueMetrics.${row.key}.fileCount`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.outputQueues.writerJobName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.outputQueueStringData.get('writerJobName');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.outputQueues.writerJobStatus'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `outputQueueMetrics.${row.key}.writerJobStatus`;
      },
      getContent: writerJobStatusFormatter,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function OutputQueueTable({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'outputQueueStringMap'], emptyMap)
    .map((outputQueueStringData, key) => {
      return {
        key,
        outputQueueStringData,
        timeConfig,
        snapshotId
      };
    })
    .valueSeq()
    .toArray();

  if (rows.length === 0) {
    return null;
  }

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.ibmIOs.dashboard.tables.outputQueues.name')}
      cols={cols}
      rows={rows}
      initialSortColumn={3}
      initialSortDirection="desc"
    />
  );
}
