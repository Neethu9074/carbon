/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Result, PaginatedResult } from '@instana/types';

import ServerTablePresenter, { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { FetchedState } from 'in-hooks/utils/types';

type OverwrittenServerTableProps =
  | 'onRowClick'
  | 'numSkeletonRows'
  | 'isSearchable'
  | 'columnDefinitions'
  | 'result'
  | 'page'
  | 'pageSize';

interface EntityTableProps<ITEM_CONFIG>
  extends Omit<ServerTablePresenterProps<ITEM_CONFIG>, OverwrittenServerTableProps> {
  columnDefinition: ColumnDefinition<ITEM_CONFIG>[];
  onClickItem: (item: ITEM_CONFIG) => void;
  fetchedConfigState: FetchedState<ITEM_CONFIG[]>;
  isSearchable?: boolean;
}

export default function EntityTable<ITEM_CONFIG>({
  onClickItem,
  columnDefinition,
  fetchedConfigState,
  isSearchable = false,
  ...restProps
}: EntityTableProps<ITEM_CONFIG>) {
  const paginatedResult = fetchedStateToPaginatedResult(fetchedConfigState);
  const { page = 0, pageSize = 0 } = paginatedResult?.data ?? {};

  return (
    <ServerTablePresenter<ITEM_CONFIG, ServerTablePresenterProps<ITEM_CONFIG>>
      getRowProps={getRowProps}
      result={paginatedResult}
      onRowClick={onClickItem}
      numSkeletonRows={3}
      page={page}
      pageSize={pageSize}
      columnDefinitions={columnDefinition}
      isSearchable={isSearchable}
      {...restProps}
    />
  );
}

function getRowProps() {
  return {
    size: 'compact'
  } as const;
}

function fetchedStateToPaginatedResult<ITEM_CONFIG>([itemConfig, , errors, progress]: FetchedState<
  ITEM_CONFIG[]
>): Result<PaginatedResult<ITEM_CONFIG>> {
  if (!itemConfig) return { errors, progress };

  const data = {
    items: itemConfig,
    page: 1,
    pageSize: itemConfig.length,
    totalHits: itemConfig.length
  };

  return { errors, progress, data };
}
