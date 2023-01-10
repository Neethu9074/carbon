/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
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
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.state;
      }
    }
  }
];

export default function SourceTransferStatesTable({ snapshot }) {
  const rows = [];
  snapshot.getIn(['data', 'SourceTransferStates'], emptyList).forEach(transfer => {
    rows.push({
      id: transfer.get('ID'),
      state: transfer.get('state'),
      key: transfer.get('ID')
    });
  });

  if (rows.length === 0) {
    return null;
  }

  return (
    <Table
      cardTitle={t('in-forge:plugins.ibmMqMftAgent.dashboard.sourceTransfersWithCount', { len: rows.length })}
      withoutPadding
      cols={cols}
      rows={rows}
    />
  );
}
