/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { debounce } from 'lodash';
import cx from 'classnames';
import React from 'react';

import {
  DataTable,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableSelectRow,
  TableToolbar,
  TableToolbarSearch
} from '@instana/carbon';
import { NoDataEmptyState } from '@instana/ibm-products';
import { Pagination } from '@instana/components';
import { OrderDirection } from '@instana/types';

import LoadingList from 'in-components/lists/List/sharedComponents/LoadingList';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/ListTable/ListDataTable.mless';

interface TableHeader {
  key: string;
  header: string;
  isSortable?: boolean;
}

interface TableRow {
  id: string;
  [key: string]: any;
}

interface ListServarDataTableProps {
  rows: TableRow[];
  pageSize: number;
  page: number;
  totalItems: number;
  isLoading: boolean;
  onPaginationChange: (page: number, pageSize: number) => void;
  headers: TableHeader[];
  selectAction: (row: TableRow) => void;
  onSearch: (query: string) => void;
  isSelectable?: boolean;
  isRadio?: boolean;
  isSearchable?: boolean;
  query?: string;
  selectedItem?: string;
  sortBy?: (sortKey: string, sortDirection: OrderDirection) => void;
  sortKey?: string;
  sortDirection: string;
}

export default function ListServerDataTable({
  rows,
  pageSize,
  page,
  totalItems,
  isLoading,
  onPaginationChange,
  headers,
  selectAction,
  onSearch,
  isSelectable,
  isRadio,
  isSearchable,
  query,
  selectedItem,
  sortDirection,
  sortBy,
  sortKey
}: ListServarDataTableProps) {
  if (isLoading) {
    return <LoadingList numSkeletonRows={3} />;
  }

  const debounceOnChange = debounce((searchInput?: string) => {
    if (searchInput !== undefined) {
      onSearch?.(searchInput);
    }
  }, 700);

  const handleSearch = (searchInputText?: string) => {
    debounceOnChange(searchInputText);
  };
  return (
    <>
      <DataTable rows={rows} headers={headers} isSortable={sortBy !== undefined}>
        {({ rows, headers, getTableProps, getHeaderProps }) => (
          <>
            <TableToolbar>
              {isSearchable && (
                <TableToolbarSearch
                  defaultExpanded
                  expanded
                  onChange={(e: React.ChangeEvent<HTMLInputElement> | '') => handleSearch(e ? e?.target?.value : query)}
                  id={`search`}
                  defaultValue={query}
                />
              )}
            </TableToolbar>
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {isSelectable && isRadio && <TableHeader> </TableHeader>}
                  {headers.map((header: any) => (
                    <TableHeader
                      {...getHeaderProps({ header })}
                      isSortable={header?.isSortable ?? false}
                      isSortHeader={header.sortKey === sortKey}
                      sortDirection={sortDirection}
                      onClick={() => {
                        const direction = sortDirection === 'ASC' ? 'DESC' : 'ASC';
                        sortBy?.(header.sortKey, direction as OrderDirection);
                      }}
                    >
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody
                className={cx({
                  [locals['empty-table-body']]: rows?.length === 0
                })}
              >
                {rows?.length === 0 && (
                  <TableRow>
                    <TableCell>
                      <NoDataEmptyState
                        title={t('in-events:eventsSmartAlerts.dialog.noDataEmptyListStateTitle')}
                        subtitle={t('in-events:eventsSmartAlerts.dialog.noDataEmptyListStateSubtitle')}
                        illustrationDescription={t(
                          'in-events:eventsSmartAlerts.dialog.noDataEmptyListStateIllustrationDescription'
                        )}
                        className={locals['empty-table']}
                      />
                    </TableCell>
                  </TableRow>
                )}
                {rows?.map(row => (
                  <TableRow key={row.id}>
                    {isSelectable && isRadio && (
                      <TableSelectRow
                        onSelect={() => selectAction(row)}
                        id={'select_row_' + row.id}
                        name={`${row.id} select`}
                        className={locals.radio}
                        checked={row.id === selectedItem}
                        radio
                      />
                    )}
                    {row.cells.map(cell => (
                      <TableCell key={cell.id}>{cell.value}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </DataTable>

      <Pagination
        totalItems={totalItems}
        pageSize={pageSize}
        page={page}
        pageSizes={[10, 20, 40, 60, 80, 100]}
        onChange={({ page, pageSize }) => onPaginationChange(page, pageSize)}
      />
    </>
  );
}
