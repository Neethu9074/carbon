/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import PropTypes from 'prop-types';
import React from 'react';

import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-events:ibmMqFileTransfer.transferId'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.transferId ?? '';
      }
    }
  },
  {
    title: t('in-events:ibmMqFileTransfer.sourceAgent'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.sourceAgent ?? '';
      }
    }
  },
  {
    title: t('in-events:ibmMqFileTransfer.destinationAgent'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.destinationAgent ?? '';
      }
    }
  },
  {
    title: t('in-events:ibmMqFileTransfer.originator'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.originator ?? '';
      }
    }
  },
  {
    title: t('in-events:ibmMqFileTransfer.status'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.status ?? '';
      }
    }
  }
];

export default function IbmMqFileTransferMetadataTable({ ibmMqFileTransferMetadata = [] }) {
  const rows = ibmMqFileTransferMetadata.map((ibmMqFileTransfer, index) => {
    return {
      ...ibmMqFileTransfer,
      key: `${index}`
    };
  });

  return (
    <Table
      cardTitle={t('in-events:ibmMqFileTransfer.failedFileTransfers')}
      cols={cols}
      rows={rows}
      getRowDetails={row => row?.details ?? ''}
    />
  );
}

IbmMqFileTransferMetadataTable.propTypes = {
  ibmMqFileTransferMetadata: PropTypes.arrayOf(
    PropTypes.shape({
      transferId: PropTypes.string,
      sourceAgent: PropTypes.string,
      destinationAgent: PropTypes.string,
      originator: PropTypes.string,
      status: PropTypes.string,
      details: PropTypes.string
    })
  )
};
