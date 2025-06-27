/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { ChangeEvent, Fragment, ReactNode, useMemo, useState } from 'react';

import {
  DataTable,
  Table,
  TableBatchAction,
  TableBatchActions,
  TableBody,
  TableCell,
  TableContainer,
  TableExpandedRow,
  TableExpandHeader,
  TableExpandRow,
  TableHead,
  TableHeader,
  TableRow,
  TableSelectAll,
  TableSelectRow,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch
} from '@instana/carbon';
import { ErrorEmptyState, NoDataEmptyState } from '@instana/ibm-products';
import { TableSkeleton } from '@instana/components';

import { CarbonHeader, ListItem, CarbonDataTableProps } from 'in-synthetics/components/constants';
import { getNextSortDirection } from 'in-synthetics/components/utils';
import { TableProps } from 'in-components/tables/ServerTable/types';
import { hasError } from 'in-services/util/result';

import locals from 'in-synthetics/components/CarbonDataTable.mless';

export const CarbonDataTable = <ITEM_TYPE extends ListItem, PropsType extends TableProps<ITEM_TYPE>>({
  rows,
  headers,
  isLoading,
  query,
  isSearchable,
  filterRows,
  searchText,
  isExpandable,
  isSelectable,
  getBatchActionItems,
  sortRow,
  toolBarContent,
  configureColumnContent,
  actionButtonContent,
  result,
  noDataHeader,
  noDataDescription,
  errorHeader
}: CarbonDataTableProps<ITEM_TYPE, PropsType>) => {
  const showToolbar = isSearchable || toolBarContent || actionButtonContent || isSelectable;
  const [expandedRowIds, setExpandedRowIds] = useState(new Set());

  const rowIdToExpanded = useMemo(() => {
    const map: Record<string, ReactNode> = {};
    rows.forEach(row => {
      if (row.expanded) {
        map[row.id] = row.expanded;
      }
    });
    return map;
  }, [rows]);

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
      {({
        rows,
        headers,
        getTableContainerProps,
        getToolbarProps,
        getHeaderProps,
        getTableProps,
        onInputChange,
        getRowProps,
        getSelectionProps,
        getBatchActionProps,
        getExpandHeaderProps,
        getExpandedRowProps
      }) => (
        <TableContainer {...getTableContainerProps()}>
          <>
            {showToolbar && (
              <TableToolbar {...getToolbarProps()}>
                <TableBatchActions {...getBatchActionProps()} className={locals.tableBatchAction}>
                  {getBatchActionItems?.()?.map(batchActionItem => (
                    <TableBatchAction
                      key={batchActionItem.actionName}
                      renderIcon={batchActionItem.renderIcon}
                      tabIndex={getBatchActionProps().shouldShowBatchActions ? 0 : -1}
                      onClick={() => {
                        const selectedIds = rows.filter(row => row.isSelected).map(row => row.id);
                        batchActionItem.onClick(selectedIds);
                      }}
                    >
                      {batchActionItem.actionName}
                    </TableBatchAction>
                  ))}
                </TableBatchActions>
                <TableToolbarContent aria-hidden={getBatchActionProps().shouldShowBatchActions}>
                  {isSearchable && (
                    <TableToolbarSearch
                      className={locals.searchBox}
                      defaultExpanded
                      defaultValue={query}
                      onChange={e => (filterRows ? filterRows(e as ChangeEvent<HTMLInputElement>) : onInputChange)}
                      placeholder={searchText}
                    />
                  )}
                  {toolBarContent ?? null}
                  {configureColumnContent ?? null}
                  {actionButtonContent ?? null}
                </TableToolbarContent>
              </TableToolbar>
            )}
            {isLoading ? (
              <TableSkeleton showHeader={false} zebra showToolbar={false} columnCount={headers.length} />
            ) : (
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    {isSelectable && rows.length !== 0 && (
                      <TableSelectAll
                        {...getSelectionProps({
                          rows
                        } as any)}
                      />
                    )}
                    {isExpandable && <TableExpandHeader {...getExpandHeaderProps()} />}
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
                  {isExpandable &&
                    rows.map(row => {
                      const isExpanded = expandedRowIds.has(row.id);
                      return (
                        <Fragment key={row.id}>
                          <TableExpandRow
                            aria-label="Row expander"
                            {...getExpandedRowProps({ row })}
                            isExpanded={isExpanded}
                            onExpand={() => {
                              const newIds = new Set(expandedRowIds);
                              if (isExpanded) newIds.delete(row.id);
                              else newIds.add(row.id);
                              setExpandedRowIds(newIds);
                            }}
                          >
                            {isSelectable && (
                              <TableSelectRow
                                {...getSelectionProps({
                                  row
                                })}
                              />
                            )}
                            {row.cells.map(cell => (
                              <TableCell key={cell.id}>{cell.value}</TableCell>
                            ))}
                          </TableExpandRow>
                          {isExpanded && (
                            <TableExpandedRow colSpan={headers.length + 2}>
                              {rowIdToExpanded[row.id] ?? ''}
                            </TableExpandedRow>
                          )}
                        </Fragment>
                      );
                    })}
                  {!isExpandable &&
                    rows.map(row => (
                      <TableRow
                        {...getRowProps({
                          row
                        })}
                      >
                        {isSelectable && (
                          <TableSelectRow
                            {...getSelectionProps({
                              row
                            })}
                          />
                        )}
                        {row.cells.map(cell => (
                          <TableCell key={cell.id}>{cell.value}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  {rows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={headers.length}>
                        {hasError(result) ? (
                          <ErrorEmptyState
                            title={errorHeader}
                            subtitle={result?.errors[0].message}
                            className={locals.noDataTile}
                          />
                        ) : (
                          <NoDataEmptyState
                            title={noDataHeader}
                            subtitle={noDataDescription}
                            className={locals.noDataTile}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </>
        </TableContainer>
      )}
    </DataTable>
  );
};
