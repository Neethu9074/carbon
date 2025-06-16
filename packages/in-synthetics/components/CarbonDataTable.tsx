/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { ChangeEvent } from 'react';

import {
  DataTable,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch
} from '@instana/carbon';
import { TableSkeleton } from '@instana/components';

import { CarbonHeader, ListItem, CarbonDataTableProps } from 'in-synthetics/components/constants';
import { getNextSortDirection } from 'in-synthetics/components/utils';
import { TableProps } from 'in-components/tables/ServerTable/types';

import locals from 'in-synthetics/components/CarbonDataTable.mless';

export const CarbonDataTable = <ITEM_TYPE extends ListItem, PropsType extends TableProps<ITEM_TYPE>>({
  rows,
  headers,
  isLoading,
  query,
  isSearchable,
  filterRows,
  searchText,
  sortRow
}: CarbonDataTableProps<ITEM_TYPE, PropsType>) => {
  const showToolbar = isSearchable;

  const handleHeaderClick = (
    header: CarbonHeader<ITEM_TYPE, PropsType>,
    headers: CarbonHeader<ITEM_TYPE, PropsType>[],
    sortRow?: (sortState: { sortDirection: string; sortHeaderKey: string }) => void
  ) => {
    sortRow?.({ sortHeaderKey: header.key, sortDirection: header.sortDirection! });
    const nextDirection = getNextSortDirection(header.key, header.key, header.sortDirection!);
    headers.forEach(o => (o.sortDirection = 'NONE'));
    header.sortDirection = nextDirection;
  };

  return (
    <DataTable rows={rows} headers={headers}>
      {({ rows, headers, getHeaderProps, onInputChange }) => (
        <TableContainer>
          <>
            {showToolbar && (
              <TableToolbar>
                <TableToolbarContent>
                  {isSearchable && (
                    <TableToolbarSearch
                      className={locals.searchBox}
                      defaultExpanded
                      defaultValue={query}
                      onChange={e => (filterRows ? filterRows(e as ChangeEvent<HTMLInputElement>) : onInputChange)}
                      placeholder={searchText}
                    />
                  )}
                </TableToolbarContent>
              </TableToolbar>
            )}
            {isLoading ? (
              <TableSkeleton showHeader={false} zebra showToolbar={false} columnCount={headers.length} />
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    {headers.map((header: CarbonHeader<ITEM_TYPE, PropsType>) => (
                      <TableHeader
                        {...getHeaderProps?.({
                          header,
                          isSortable: header?.isSortable,
                          style: !header?.isSortable
                            ? { width: header.widthInAbsoluteUnit ? header.width : header.width + '%' }
                            : {}
                        })}
                        isSortHeader={header?.isSortable}
                        sortDirection={header?.sortDirection ?? 'NONE'}
                        onClick={() =>
                          handleHeaderClick(header, headers as CarbonHeader<ITEM_TYPE, PropsType>[], sortRow)
                        }
                        key={header?.key}
                      >
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {rows.map(row => (
                    <TableRow key={row.id}>
                      {row.cells.map(cell => (
                        <TableCell key={cell.id}>{cell.value}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </>
        </TableContainer>
      )}
    </DataTable>
  );
};
