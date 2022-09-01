/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.ibmMqMftFileTransferLog.dashboard.sourceFileName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.item.get('sourceFileName');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqMftFileTransferLog.dashboard.sourceFileSize'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.item.get('sourceFileSize');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqMftFileTransferLog.dashboard.destinationFileName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.item.get('destinationFileName');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqMftFileTransferLog.dashboard.destinationFileSize'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.item.get('destinationFileSize');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqMftFileTransferLog.dashboard.transferMode'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.item.get('transferMode');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqMftFileTransferLog.dashboard.checkSumMethod'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.item.get('checkSumMethod');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqMftFileTransferLog.dashboard.checkSumValue'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.item.get('checkSumValue');
      }
    }
  }
];

export default function FileTransferItemsTable({ snapshot, timeConfig }) {
  const rows = snapshot
    .map((item, name) => {
      return {
        key: name,
        item,
        timeConfig
      };
    })
    .valueSeq()
    .toArray();

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.ibmMqMftFileTransferLog.dashboard.itemsWithCount', { len: rows.length })}
      cols={cols}
      rows={rows}
    />
  );
}
