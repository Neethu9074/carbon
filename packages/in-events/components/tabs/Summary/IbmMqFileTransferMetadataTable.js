/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { DataTable as CarbonDataTable, Card } from '@instana/components';

import { t } from 'in-i18n';

import locals from './IbmMqFileTransferMetadataTable.mless';

export default function IbmMqFileTransferMetadataTable({ ibmMqFileTransferMetadata = [] }) {
  const rows = ibmMqFileTransferMetadata.map((ibmMqFileTransfer, index) => {
    return {
      ...ibmMqFileTransfer,
      key: `${index}`
    };
  });

  const [sortState, setSortState] = useState({
    sortKey: null,
    direction: 'NONE' // Can be 'ASC', 'DESC', or 'NONE'
  });

  const handleSort = headerKey => {
    setSortState(prevState => {
      const isSameKey = prevState.sortKey === headerKey;
      const newDirection = isSameKey ? (prevState.direction === 'ASC' ? 'DESC' : 'ASC') : 'ASC';
      return { sortKey: headerKey, direction: newDirection };
    });
  };

  const carbonHeaders = [
    {
      key: 'transferID',
      header: t('in-events:ibmMqFileTransfer.transferID'),
      isSortable: true,
      sortDirection: sortState.sortKey === 'transferID' ? sortState.direction : 'NONE'
    },
    {
      key: 'sourceAgent',
      header: t('in-events:ibmMqFileTransfer.sourceAgent'),
      isSortable: true,
      sortDirection: sortState.sortKey === 'sourceAgent' ? sortState.direction : 'NONE'
    },
    {
      key: 'destinationAgent',
      header: t('in-events:ibmMqFileTransfer.destinationAgent'),
      isSortable: true,
      sortDirection: sortState.sortKey === 'destinationAgent' ? sortState.direction : 'NONE'
    },
    {
      key: 'originator',
      header: t('in-events:ibmMqFileTransfer.originator'),
      isSortable: true,
      sortDirection: sortState.sortKey === 'originator' ? sortState.direction : 'NONE'
    },
    {
      key: 'status',
      header: t('in-events:ibmMqFileTransfer.status'),
      isSortable: true,
      sortDirection: sortState.sortKey === 'status' ? sortState.direction : 'NONE'
    }
  ];

  const sortedRows = [...rows].sort((a, b) => {
    const { sortKey, direction } = sortState;
    if (!sortKey || direction === 'NONE') return 0;

    let aValue = a[sortKey];
    let bValue = b[sortKey];

    aValue = aValue ? aValue.toString().toLowerCase() : '';
    bValue = bValue ? bValue.toString().toLowerCase() : '';

    if (aValue === bValue) return 0;
    if (direction === 'ASC') return aValue > bValue ? 1 : -1;
    if (direction === 'DESC') return aValue < bValue ? 1 : -1;
  });

  const carbonRows = sortedRows.map((row, index) => ({
    id: `row-${index}`,
    transferID: row.transferID ?? '',
    sourceAgent: row.sourceAgent ?? '',
    destinationAgent: row.destinationAgent ?? '',
    originator: row.originator ?? '',
    status: row.status ?? '',
    details: row.details ?? '',
    expanded: RowDetails(row)
  }));

  return (
    <Card title={t('in-events:ibmMqFileTransfer.failedFileTransfers')}>
      <CarbonDataTable
        headers={carbonHeaders}
        rows={carbonRows}
        sortRow={({ sortHeaderKey }) => handleSort(sortHeaderKey)}
        isSearchEnabled
        isExpandable
      />
    </Card>
  );
}

function RowDetails(row) {
  const detailsText = row?.details ?? t('in-events:noRelatedEvents');
  return <div className={locals.details}>{detailsText}</div>;
}

IbmMqFileTransferMetadataTable.propTypes = {
  ibmMqFileTransferMetadata: PropTypes.arrayOf(
    PropTypes.shape({
      transferID: PropTypes.string,
      sourceAgent: PropTypes.string,
      destinationAgent: PropTypes.string,
      originator: PropTypes.string,
      status: PropTypes.string,
      details: PropTypes.string
    })
  )
};
