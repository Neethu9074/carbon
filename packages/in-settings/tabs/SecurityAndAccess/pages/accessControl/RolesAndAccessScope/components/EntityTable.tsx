/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { Result, PaginatedResult } from '@instana/types';

import EntityTablePaginator from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/components/EntityTablePaginator';
import ServerTablePresenter, {
  ListItem,
  ServerTablePresenterProps
} from 'in-components/tables/ServerTable/ServerTablePresenter';
import { carbonCheckboxEnabled, carbonTableEnabled } from 'in-services/featureFlags';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { FetchedState } from 'in-hooks/utils/types';

import locals from './EntityTable.mless';

type OverwrittenServerTableProps =
  | 'onRowClick'
  | 'numSkeletonRows'
  | 'isSearchable'
  | 'columnDefinitions'
  | 'result'
  | 'page'
  | 'pageSize';

interface EntityTableProps<ITEM_CONFIG extends ListItem>
  extends Omit<ServerTablePresenterProps<ITEM_CONFIG>, OverwrittenServerTableProps> {
  columnDefinition: ColumnDefinition<ITEM_CONFIG>[];
  onClickItem: (item: ITEM_CONFIG) => void;
  fetchedConfigState: FetchedState<ITEM_CONFIG[]>;
  isSearchable?: boolean;
  paginated?: boolean;
  disableRowClick?: boolean;
}

export default function EntityTable<ITEM_CONFIG extends ListItem>({
  onClickItem,
  columnDefinition,
  fetchedConfigState,
  isSearchable = false,
  paginated = false,
  disableRowClick = false,
  ...restProps
}: EntityTableProps<ITEM_CONFIG>) {
  const [page, setPage] = useState(1);
  const result = fetchedStateToPaginatedResult(fetchedConfigState);

  let paginatedResult: Result<PaginatedResult<ITEM_CONFIG>>;
  let loadMore: () => void;
  let hasMorePages: boolean;
  let pageSize: number;

  if (paginated) {
    const size = 10;
    const start = page === 1 ? 0 : page * size;
    const end = start + size;
    paginatedResult = {
      ...result,
      data: {
        pageSize: size,
        page,
        totalHits: result.data?.totalHits ?? 0,
        items: result.data?.items?.slice(0, end) ?? []
      }
    };
    loadMore = () => setPage(c => c + 1);
    hasMorePages = paginatedResult.data?.items?.length !== paginatedResult.data?.totalHits;
    pageSize = paginatedResult.data?.items?.length ?? 0;
  } else {
    paginatedResult = result;
    loadMore = () => {};
    hasMorePages = false;
    pageSize = paginatedResult.data?.totalHits ?? 0;
  }

  return (
    <div className={carbonTableEnabled ? locals.paddingInCarbonTable : undefined}>
      <ServerTablePresenter<ITEM_CONFIG, ServerTablePresenterProps<ITEM_CONFIG>>
        getRowProps={getRowProps}
        result={paginatedResult}
        onRowClick={
          disableRowClick
            ? () => null
            : (data, e) => {
                // TODO Remove if condition as part of Legacy Checkbox Cleanup scheduled in INSTA-15417
                if (carbonCheckboxEnabled) e.preventDefault();
                onClickItem(data);
              }
        }
        numSkeletonRows={3}
        page={page}
        pageSize={pageSize}
        columnDefinitions={columnDefinition}
        renderPagination={() => hasMorePages && <EntityTablePaginator loadMore={loadMore} />}
        isSearchable={isSearchable}
        searchWidth={'8.75rem'}
        {...restProps}
      />
    </div>
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
