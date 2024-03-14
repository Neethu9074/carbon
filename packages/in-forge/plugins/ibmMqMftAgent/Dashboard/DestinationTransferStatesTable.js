/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { formatDateTime } from 'in-services/formatters/date';
import Table from 'in-sdk/components/dashboard/Table';
import { StatesMap } from './TransferStates';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.ibmMqMftAgent.dashboard.transferID'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.id;
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqMftAgent.dashboard.transferState'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `as.dst.${row.id}.state`;
      },
      getContent(value) {
        return StatesMap[value];
      },
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqMftAgent.dashboard.transferStateCapturedTime'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `as.dst.${row.id}.capturedTime`;
      },
      getContent(value) {
        return formatDateTime(value);
      },
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function DestinationTransferStatesTable({ snapshot }) {
  const snapshotId = snapshot.get('id');
  const regex = /^as.dst.(.*)\.state$/;
  const metricIds = snapshot.get('metricIds');
  const rows = metricIds
    .filter(metricId => regex.test(metricId))
    .map(metricId => {
      return {
        id: metricId.match(regex)[1],
        key: metricId.match(regex)[1],
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
      cardTitle={t('in-forge:plugins.ibmMqMftAgent.dashboard.destinationTransfersWithCount', { len: rows.length })}
      withoutPadding
      cols={cols}
      rows={rows}
    />
  );
}
