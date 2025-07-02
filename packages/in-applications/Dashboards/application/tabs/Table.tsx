/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState, useEffect, useRef, forwardRef } from 'react';

import { TableBody, TableRow, TableCell, TableHeader, TableHead, DataTable } from '@instana/carbon';
import { Pagination as CarbonPagination, CarbonTable } from '@instana/components';

// @ts-ignore - Add ts-ignore to handle missing declaration file
import { createStore } from 'in-infrastructure/tableView/components/Table/stores/content';

import locals from 'in-infrastructure/tableView/components/Table/Table.mless';

const carbonFooterElement = locals.carbonFooter;

interface TableProps {
  cols: any[];
  rows: any[];
  maxItemsPerPage?: number;
  initialSortColumn?: number;
  initialSortDirection?: string;
  disableSorting?: boolean;
  getRowDetails?: any;
  showExpandAll?: boolean;
  noDataText?: string;
  alwaysShowPagination?: boolean;
  leftHeader?: React.ReactNode;
  rightHeader?: React.ReactNode;
  contentBetweenHeaderAndTable?: React.ReactNode;
  className?: string;
  onRowClick?: (row: any) => void;
}

const Table = forwardRef<any, TableProps>((props, ref) => {
  const {
    cols,
    rows,
    maxItemsPerPage = 10,
    initialSortColumn = 0,
    initialSortDirection = 'asc',
    disableSorting = false,
    getRowDetails,
    alwaysShowPagination,
    leftHeader,
    rightHeader,
    contentBetweenHeaderAndTable,
    className
  } = props;

  const [data, setData] = useState<any>(null);
  const [pageSize, setPageSize] = useState<number>(maxItemsPerPage);
  const [store, setStore] = useState<any>(null);
  const [dataSubscription, setDataSubscription] = useState<any>(null);
  const tableRef = useRef<any>(null);

  // Create a new store
  const newStore = () => {
    const storeInstance = createStore({
      columnDefinitions: cols,
      maxItemsPerPage: pageSize,
      initialSortColumn: initialSortColumn,
      initialSortDirection: initialSortDirection,
      disableSorting: disableSorting
    });

    storeInstance.onRowChange(rows);

    const subscription = storeInstance.sortedPagedData$.subscribe((newData: any) => {
      setData(newData);
    });

    setStore(storeInstance);
    setDataSubscription(subscription);

    return { storeInstance, subscription };
  };

  // Dispose of store and subscription
  const dispose = () => {
    if (dataSubscription) {
      dataSubscription.dispose();
    }
    if (store) {
      store.dispose();
    }
  };

  // Initialize store on mount
  useEffect(() => {
    const { storeInstance } = newStore();

    return () => {
      if (dataSubscription) {
        dataSubscription.dispose();
      }
      if (storeInstance) {
        storeInstance.dispose();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle changes to columns or maxItemsPerPage
  useEffect(() => {
    if (store && (cols || maxItemsPerPage !== pageSize)) {
      dispose();
      newStore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cols, maxItemsPerPage]);

  // Handle changes to rows
  useEffect(() => {
    if (store && rows) {
      store.onRowChange(rows);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);

  // Handle changes to pageSize
  useEffect(() => {
    if (pageSize !== maxItemsPerPage) {
      dispose();
      newStore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize]);

  if (!data || !store) {
    return null;
  }

  const supportsRowDetails = getRowDetails != null;
  const toggleRowDetails = supportsRowDetails ? store.toggleExpanded : null;

  const carbonHeaders = cols.map((item, i) => ({
    id: i,
    key: item.title,
    header: item.title,
    isSortable: true,
    isSelected: item.isSelected,
    isExpandable: toggleRowDetails,
    sortDirection: data.sortColumnIndex === i ? data.sortDirection.toUpperCase() : 'NONE',
    typeArgs: item.typeArgs,
    type: item.type,
    width: item.width,
    ellipsis: item.ellipsis
  }));

  let carbonRows: any[] = [];
  let emptyTable = <></>;

  if (data.rows?.length) {
    // when api returns data
    for (let i = 0, length = data.rows?.length; i < length; i++) {
      const carbonRow: any = {};
      carbonRow['id'] = data.rows[i].key;
      carbonRow['isSelected'] = data.rows[i].rowConfig.isSelected;
      data.rows[i].columns.map((column: any, i: number) => {
        // get column header name and assign value to that
        carbonRow[carbonHeaders[i]['header']] = column.content ?? '-';
      });
      carbonRows.push(carbonRow);
    }
  }

  const sortRow = ({ sortHeaderKey: orderBy, sortDirection }: { sortHeaderKey: string; sortDirection: string }) => {
    const column = carbonHeaders.find(x => x.header === orderBy);

    if (!column) return;

    const { type: colType } = column;
    const isSortDirectionNone = sortDirection === 'NONE';

    const orderDirection = isSortDirectionNone
      ? colType === 'string'
        ? 'ASC'
        : 'DESC'
      : sortDirection === 'ASC'
      ? 'DESC'
      : 'ASC';

    const columnIndex = carbonHeaders.indexOf(column);
    store.setSort(columnIndex, orderDirection.toLowerCase());
  };

  const showPagination = data.pageCount > 1 || data.page >= data.pageCount || alwaysShowPagination;
  const showHeader = leftHeader || rightHeader || showPagination;

  return (
    <div className={className}>
      {contentBetweenHeaderAndTable}
      {/* carbon empty table render */}
      {data?.rows?.length === 0 && emptyTable}
      {/* carbon with data table render */}
      {data?.rows?.length !== 0 && (
        <DataTable ref={ref || tableRef} rows={carbonRows} headers={carbonHeaders} isSortable>
          {({ rows, headers, getHeaderProps, getRowProps, getTableProps, sortBy }: any) => {
            return (
              <CarbonTable {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    {headers.map((header: any, i: number) => (
                      <TableHeader
                        key={header.id}
                        {...getHeaderProps({
                          header
                        })}
                        isSortable
                        isSortHeader={data.sortColumnIndex === i}
                        sortDirection={header.sortDirection}
                        onClick={() => {
                          sortBy(header.key);
                          sortRow({
                            sortHeaderKey: header.key,
                            sortDirection: header.sortDirection
                          });
                        }}
                      >
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row: any, i: number) => (
                    <TableRow
                      key={i}
                      {...getRowProps({ row })}
                      onClick={() => props.onRowClick && props.onRowClick(row)}
                    >
                      {row.cells.map((cell: any) => (
                        <TableCell key={cell.id}>
                          <span onClick={evt => evt.stopPropagation()}>{cell.value}</span>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </CarbonTable>
            );
          }}
        </DataTable>
      )}
      {showHeader ? (
        <>
          {showPagination ? (
            <div className={carbonFooterElement}>
              <CarbonPagination
                currentPage={(data.page || 0) + 1}
                totalItems={rows?.length}
                pageSize={pageSize}
                pageSizes={[maxItemsPerPage, maxItemsPerPage * 2]}
                onChange={(p: any) => {
                  if (pageSize !== p.pageSize) {
                    setPageSize(p.pageSize);
                  }
                  store.setPage(p.page - 1);
                }}
              />
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
});

export default Table;
