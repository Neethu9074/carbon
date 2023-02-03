/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { emptyMap } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.ibmMqMftTransfer.dashboard.sourceFileName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.item.get('sourceFileName');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqMftTransfer.dashboard.sourceFileSize'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.item.get('sourceFileSize');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqMftTransfer.dashboard.destinationFileName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.item.get('destinationFileName');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqMftTransfer.dashboard.destinationFileSize'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.item.get('destinationFileSize');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqMftTransfer.dashboard.transferMode'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.item.get('transferMode');
      }
    }
  }
];

export default function TransferItemTable({ snapshot, snapshotId, timeConfig }) {
  const rows = snapshot
    .getIn(['data', 'transferItems'], emptyMap)
    .map((item, name) => {
      return {
        key: name,
        item,
        timeConfig,
        snapshotId
      };
    })
    .toArray();

  if (rows.length === 0) {
    return null;
  }

  return (
    <Table
      cardTitle={t('in-forge:plugins.ibmMqMftTransfer.dashboard.itemsWithCount', { len: rows.length })}
      withoutPadding
      cols={cols}
      rows={rows}
    />
  );
}
