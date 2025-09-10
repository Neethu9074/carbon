/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import type { ExpandedState, SortingState, OnChangeFn, PaginationState, ColumnDef } from '@tanstack/react-table';
import { getCoreRowModel, useReactTable, getExpandedRowModel } from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';

import { generateStableHash } from '@instana/utils';

import { ServerTableUrlState } from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import { Gateway } from 'in-aihub/GatewaysCatalogComponents/useGatewaysData';

interface UseGatewaysTableParams {
  serverTableUrlState: ServerTableUrlState;
  setServerTableState: (change: Partial<ServerTableUrlState>) => void;
  data: Gateway[];
  columns: ColumnDef<Gateway, any>[];
}
const getRowCanExpand = () => true;
const getRowId = (row: Gateway) => row.id!;
export default function useGatewaysTable({
  serverTableUrlState,
  setServerTableState,
  data,
  columns
}: UseGatewaysTableParams) {
  const { page, pageSize, orderBy, orderDirection, query } = serverTableUrlState;
  const [expanded, setExpanded] = useState<ExpandedState>({});

  // Use stable hash to prevent unnecessary re-renders
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const tableData = useMemo(() => data ?? [], [generateStableHash(data)]);

  const state = useMemo(
    () => ({
      expanded,
      globalFilter: query,
      pagination: {
        defaultPage: 1,
        pageIndex: page,
        pageSize
      },
      sorting: [{ desc: orderDirection === 'DESC', id: orderBy }]
    }),
    [expanded, orderBy, orderDirection, page, pageSize, query]
  );

  const onSortingChange: OnChangeFn<SortingState> = useCallback(
    sortingState => {
      const sorting = typeof sortingState === 'function' ? sortingState(state.sorting) : sortingState;
      if (sorting.length === 0) {
        setServerTableState({ orderBy: undefined, orderDirection: undefined });
      } else {
        const [{ desc, id: orderBy }] = sorting;
        const orderDirection = desc ? 'DESC' : 'ASC';
        setServerTableState({ orderBy, orderDirection });
      }
    },
    [setServerTableState, state.sorting]
  );

  const onGlobalFilterChange: OnChangeFn<string> = useCallback(
    globalFilter => {
      const query = typeof globalFilter === 'function' ? globalFilter(state.globalFilter) : globalFilter;
      setServerTableState({ query, page: state.pagination.defaultPage });
    },
    [setServerTableState, state.globalFilter, state.pagination.defaultPage]
  );

  const onPaginationChange: OnChangeFn<PaginationState> = useCallback(
    pagination => {
      const { pageIndex, pageSize } = typeof pagination === 'function' ? pagination(state.pagination) : pagination;
      setServerTableState({ page: pageIndex, pageSize });
    },
    [state.pagination, setServerTableState]
  );

  return useReactTable({
    data: tableData,
    columns,
    state,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    onGlobalFilterChange,
    onExpandedChange: setExpanded,
    getRowCanExpand,
    getRowId,
    onSortingChange,
    onPaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    rowCount: data?.length
  });
}
