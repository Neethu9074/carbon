/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import {
  getCoreRowModel,
  useReactTable,
  ExpandedState,
  getExpandedRowModel,
  SortingState,
  OnChangeFn,
  PaginationState,
  ColumnDef
} from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';

import { generateStableHash } from '@instana/utils';
import { PaginatedResult } from '@instana/types';

import { ServerTableUrlState } from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import { CorrectionWindowListItem } from 'in-service-levels/types';

const getRowCanExpand = () => true;
const getRowId = (row: CorrectionWindowListItem) => row.configuration.id!;

interface UseCorrectionWindowsTableParams {
  serverTableUrlState: ServerTableUrlState;
  setServerTableState: (change: Partial<ServerTableUrlState>) => void;
  result: PaginatedResult<CorrectionWindowListItem> | undefined;
  columns: ColumnDef<CorrectionWindowListItem, any>[];
}

export default function useCorrectionWindowsTable({
  serverTableUrlState,
  setServerTableState,
  result,
  columns
}: UseCorrectionWindowsTableParams) {
  const { page, pageSize, orderBy, orderDirection, query } = serverTableUrlState;
  const [expanded, setExpanded] = useState<ExpandedState>({});

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const data = useMemo(() => result?.items ?? [], [generateStableHash(result?.items)]);

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
    data,
    columns,
    state,
    onExpandedChange: setExpanded,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    getRowCanExpand,
    getRowId,
    getExpandedRowModel: getExpandedRowModel(),
    rowCount: result?.totalHits,
    onGlobalFilterChange,
    onSortingChange,
    onPaginationChange,
    getCoreRowModel: getCoreRowModel()
  });
}
