/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import { DataTable, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@instana/carbon';

import LoadingList from 'in-components/lists/List/sharedComponents/LoadingList';
import { isLoading } from 'in-services/util/result';

export default function BuiltInSmartAlertsSelectionBaseList({
  alertConfigsResult,
  columnDefinitions = [],
  onItemSelect,
  alertIds,
  applicationId
}) {
  const loading = isLoading(alertConfigsResult);
  const alertConfigs = alertConfigsResult.data;

  const carbonHeaders = columnDefinitions.map(item => ({
    key: item?.id,
    header: item?.label || '',
    isSortable: false,
    getContent: item?.getContent,
    sortDirection: 'NONE'
  }));

  const carbonRows =
    alertConfigs?.map?.((item, index) => {
      const rowId = { id: item.id ?? String(index) };

      // Using reduce to directly build the object
      const carbonRow = carbonHeaders.reduce((acc, header) => {
        acc[header.key] = header.getContent(item, onItemSelect, alertIds, index, applicationId);
        return acc;
      }, rowId); // Start with rowId to include 'id' key

      return carbonRow;
    }) || [];

  if (loading) {
    return <LoadingList numSkeletonRows="3" />;
  }

  return (
    <>
      <DataTable rows={carbonRows} headers={carbonHeaders} isSearchEnabled={false}>
        {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => {
          return (
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {headers.map(header => (
                    <TableHeader {...getHeaderProps({ header })}>{header.header}</TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(row => (
                  <TableRow {...getRowProps({ row })}>
                    {row.cells.map(cell => {
                      return <TableCell key={cell.id}>{cell.value}</TableCell>;
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          );
        }}
      </DataTable>
    </>
  );
}

BuiltInSmartAlertsSelectionBaseList.propTypes = {
  alertConfigsResult: PropTypes.object,
  columnDefinitions: PropTypes.array
};
