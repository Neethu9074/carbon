/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useCallback, useMemo } from 'react';

import { generateStableHash } from '@instana/utils';

import {
  createBlueprintUrlParameter,
  createEntityIdUrlParameter,
  createSloStatusUrlParameter,
  createTagsUrlParameter
} from 'in-service-levels/navigation/urlParameters';
import useServerTableUrlState from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import { SloListFilterState } from 'in-service-levels/hooks/useSloListFilterUrlState';
import { getColumnDefinitions } from 'in-service-levels/components/SloList/SloList';
import useSloListItems from 'in-service-levels/hooks/useSloListItems';

export interface SloListTableProps {
  pathSegment: string;
  matrixPrefix?: string;
  entityIds?: string;
  isMediumWidth?: boolean;
  isSmallWidth?: boolean;
  showEntityInfo?: boolean;
  filterUrlPathParams: SloListFilterState;
}

export default function useSloListTable({
  pathSegment,
  matrixPrefix = '',
  isMediumWidth,
  isSmallWidth,
  showEntityInfo,
  entityIds,
  filterUrlPathParams
}: SloListTableProps) {
  const [{ page, pageSize, orderBy, orderDirection, query }, setServerTableState] = useServerTableUrlState({
    pathSegment,
    matrixPrefix,
    defaultOrderBy: 'name',
    defaultPageSize: 10,
    paginationResettingUrlParameters: [
      createEntityIdUrlParameter(pathSegment, matrixPrefix),
      createTagsUrlParameter(pathSegment, matrixPrefix),
      createSloStatusUrlParameter(pathSegment, matrixPrefix),
      createBlueprintUrlParameter(pathSegment, matrixPrefix)
    ]
  });

  const columns = useMemo(
    () => getColumnDefinitions({ isMediumWidth, isSmallWidth, showEntityInfo }),
    [isMediumWidth, isSmallWidth, showEntityInfo]
  );
  const { tags, entityType, sloStatus, blueprint } = useMemo(
    () => filterUrlPathParams,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [generateStableHash(filterUrlPathParams)]
  );

  const result = useSloListItems({
    page,
    pageSize,
    orderBy,
    orderDirection,
    query,
    tags,
    entityIds,
    entityType,
    sloStatus,
    blueprint
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const data = useMemo(() => result?.data?.items ?? [], [generateStableHash(result?.data?.items)]);

  const state = useMemo(
    () => ({
      globalFilter: query,
      pagination: {
        defaultPage: 1,
        pageIndex: page,
        pageSize
      },
      sorting: [{ desc: orderDirection === 'DESC', id: orderBy }]
    }),
    [orderBy, orderDirection, page, pageSize, query]
  );

  const table = useReactTable({
    data,
    columns,
    state,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    enableColumnResizing: false,
    rowCount: result?.data?.totalHits,
    onGlobalFilterChange: useCallback(
      globalFilter => {
        const query = typeof globalFilter === 'function' ? globalFilter(state.globalFilter) : globalFilter;
        setServerTableState({ query, page: state.pagination.defaultPage });
      },
      [setServerTableState, state.globalFilter, state.pagination.defaultPage]
    ),
    onSortingChange: useCallback(
      sortingState => {
        const sortBy = typeof sortingState === 'function' ? sortingState(state.sorting) : sortingState;
        if (sortBy.length === 0) {
          setServerTableState({ orderBy: undefined, orderDirection: undefined });
          return;
        }
        const [{ desc, id: orderBy }] = sortBy;
        const orderDirection = desc ? 'DESC' : 'ASC';
        setServerTableState({ orderBy, orderDirection });
      },
      [setServerTableState, state.sorting]
    ),
    onPaginationChange: useCallback(
      pagination => {
        const { pageIndex, pageSize } = typeof pagination === 'function' ? pagination(state.pagination) : pagination;
        setServerTableState({ page: pageIndex, pageSize });
      },
      [setServerTableState, state.pagination]
    ),
    getCoreRowModel: getCoreRowModel()
  });
  return {
    table,
    tableProps: {
      page,
      pageSize,
      orderBy,
      orderDirection,
      query,
      setServerTableState
    },
    result
  };
}
