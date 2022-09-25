/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.ibmMqMftFileTransferStatus.dashboard.sourceAgent'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.data.get('fileTransferStatusData.' + row.key + '.sourceAgent');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqMftFileTransferStatus.dashboard.destinationAgent'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.data.get('fileTransferStatusData.' + row.key + '.destinationAgent');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqMftFileTransferStatus.dashboard.sourceFileName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.data.get('fileTransferStatusData.' + row.key + '.sourceFileName');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqMftFileTransferStatus.dashboard.startedTime'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.data.get('fileTransferStatusData.' + row.key + '.startedTime');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqMftFileTransferStatus.dashboard.fileNumber'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.data.get('fileTransferStatusData.' + row.key + '.fileNumber');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqMftFileTransferStatus.dashboard.elapsedSeconds'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'fileTransferStatusData.' + row.key + '.elapsedSeconds';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqMftFileTransferStatus.dashboard.statsTransferredBytes'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'fileTransferStatusData.' + row.key + '.statsTransferredBytes';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function FileTransferStatusTable({ snapshot, timeConfig }) {
  const fileTransferStatus = snapshot.getIn(['data', 'fileTransferStatus'], emptyList);
  if (fileTransferStatus.size === 0) {
    return null;
  }

  const rows = fileTransferStatus.toArray().map(fileTransferStatus => {
    return {
      key: fileTransferStatus,
      snapshotId: snapshot.get('id'),
      timeConfig,
      data: snapshot.get('data')
    };
  });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.ibmMqMftAgent.dashboard.transferStatusWithCount', { len: rows.length })}
      cols={cols}
      rows={rows}
      initialSortDirection="desc"
      initialSortColumn={2}
    />
  );
}
