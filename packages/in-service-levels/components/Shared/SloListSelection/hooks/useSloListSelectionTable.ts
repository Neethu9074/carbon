/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import {
  getCoreRowModel,
  useReactTable,
  OnChangeFn,
  SortingState,
  PaginationState,
  RowSelectionState,
  ColumnDef
} from '@tanstack/react-table';
import { useCallback, useMemo } from 'react';
import { Field, Item } from 'formalistic';

import { generateStableHash } from '@instana/utils';
import { PaginatedResult } from '@instana/types';

import { ServerTableUrlState } from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import { SelectSloListItem } from 'in-service-levels/types';

const getRowId = (row: SelectSloListItem) => row.configuration.id!;

interface UseSloListSelectionTableProps {
  serverTableUrlState: ServerTableUrlState;
  setServerTableState: (change: Partial<ServerTableUrlState>) => void;
  result: PaginatedResult<SelectSloListItem> | undefined;
  sloIdsField: Field<string[]>;
  onSelect: (i: Item) => void;
  columns: ColumnDef<SelectSloListItem, any>[];
}

export default function useSloListSelectionTable({
  serverTableUrlState,
  setServerTableState,
  result,
  sloIdsField,
  onSelect,
  columns
}: UseSloListSelectionTableProps) {
  const { page, pageSize, orderBy, orderDirection, query } = serverTableUrlState;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const data = useMemo(() => result?.items ?? [], [generateStableHash(result?.items)]);

  const sloIds = sloIdsField.value;
  const state = useMemo(
    () => ({
      globalFilter: query,
      pagination: {
        defaultPage: 1,
        pageIndex: page,
        pageSize
      },
      sorting: [{ desc: orderDirection === 'DESC', id: orderBy }],
      rowSelection: sloIds.reduce((rowSelection, id) => ({ ...rowSelection, [id]: true }), {})
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [orderBy, orderDirection, page, pageSize, query, generateStableHash(sloIds)]
  );

  const onSortingChange: OnChangeFn<SortingState> = useCallback(
    sortingState => {
      const [{ desc, id: orderBy }] = typeof sortingState === 'function' ? sortingState(state.sorting) : sortingState;
      const orderDirection = desc ? 'DESC' : 'ASC';
      setServerTableState({ orderBy, orderDirection });
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

  const onRowSelectionChange: OnChangeFn<RowSelectionState> = rowSelection => {
    const sloIdsRowSelection = typeof rowSelection === 'function' ? rowSelection(state.rowSelection) : rowSelection;
    const sloIds = Object.entries(sloIdsRowSelection)
      .filter(([_, selected]) => selected)
      .map(([id]) => id);
    onSelect(sloIdsField.setValue(sloIds).setTouched(true));
  };

  return useReactTable({
    data,
    columns,
    state,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    rowCount: result?.totalHits,
    onGlobalFilterChange,
    onPaginationChange,
    onRowSelectionChange,
    onSortingChange,
    getRowId
  });
}
