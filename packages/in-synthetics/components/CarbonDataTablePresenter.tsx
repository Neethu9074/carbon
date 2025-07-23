/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useCallback, useMemo } from 'react';

import { Pagination as CarbonPagination } from '@instana/components';
import { PaginatedResult, Result } from '@instana/types';

import { ListItem, CarbonDataTablePresenterProps, TableState } from 'in-synthetics/components/constants';
import { useColumnManagement } from 'in-synthetics/components/hooks/useColumnManagement';
import { useSearchHandler } from 'in-synthetics/components/hooks/useSearchHandler';
import { useTableHeaders } from 'in-synthetics/components/hooks/useTableHeaders';
import { ConfigureColumns } from 'in-synthetics/components/ConfigureColumns';
import { CarbonDataTable } from 'in-synthetics/components/CarbonDataTable';
import { useTableRows } from 'in-synthetics/components/hooks/useTableRows';
import { noop, pendingResult } from 'in-services/fixedObjects';
import { sortHandler } from 'in-synthetics/components/utils';
import { isLoading } from 'in-services/util/result';

/**
 * CarbonDataTablePresenter component
 * Renders a data table with pagination, search, and column configuration
 */
export default function CarbonDataTablePresenter<ITEM_TYPE extends ListItem>(
  props: CarbonDataTablePresenterProps<ITEM_TYPE> & TableState
) {
  const {
    query,
    columnDefinitions,
    orderBy,
    orderDirection,
    page,
    pageSize,
    pageSizes,
    optionalColumns = [],
    disabledColumns,
    enabledColumns,
    result: incomingResult,
    getRowDetails,
    onChange = noop
  } = props;

  // Use default page size if provided or fall back to pageSize
  const defaultPageSize = pageSizes?.[0] ?? pageSize;

  // Use column management hook to handle column-related state
  const { columnDefinitionsParsed, disabledColumnsParsed, visibleColumns } = useColumnManagement<ITEM_TYPE>(
    columnDefinitions,
    optionalColumns,
    disabledColumns,
    enabledColumns
  );

  // Use result from props or default to pending result
  const result = incomingResult ?? (pendingResult as Result<PaginatedResult<ITEM_TYPE>>);

  // Create debounced search handler
  const debounceOnChange = useSearchHandler(onChange, orderBy, orderDirection, pageSize, pageSizes);

  // Handle search input changes
  const handleSearchRows = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      debounceOnChange(e?.target?.value);
    },
    [debounceOnChange]
  );

  // Transform column definitions into table headers
  const carbonHeaders = useTableHeaders<ITEM_TYPE>(visibleColumns, orderBy, orderDirection);

  // Transform data items into table rows
  const carbonRows = useTableRows<ITEM_TYPE>(result, carbonHeaders, props, getRowDetails);

  // Create sort handler for table
  const sortRow = useMemo(
    () => sortHandler(carbonHeaders, onChange, pageSize, query, pageSizes),
    [carbonHeaders, onChange, pageSize, query, pageSizes]
  );

  // Determine if column configurator should be shown
  const shouldShowColumnConfigurator = !!optionalColumns?.length;

  // Determine loading state
  const loading = isLoading(result) || props.loading;

  // Determine if pagination should be shown
  const showPagination = !loading && result?.data && result?.data?.totalHits > defaultPageSize;

  return (
    <>
      <CarbonDataTable
        rows={carbonRows}
        headers={carbonHeaders}
        isLoading={loading}
        searchRows={handleSearchRows}
        sortRow={sortRow}
        configureColumnContent={
          shouldShowColumnConfigurator && (
            <ConfigureColumns
              visibleColumns={visibleColumns}
              columnDefinitions={columnDefinitionsParsed}
              disabledColumns={disabledColumnsParsed}
              isResultLoading={result.progress.loading}
              onSubmit={onChange}
            />
          )
        }
        {...props}
      />
      {showPagination && (
        <CarbonPagination
          currentPage={page}
          totalItems={result?.data?.totalHits}
          pageSize={pageSize}
          pageSizes={pageSizes ?? [pageSize]}
          onChange={({ page, pageSize }) => {
            onChange({ query, orderBy, orderDirection, page, pageSize, pageSizes });
          }}
        />
      )}
    </>
  );
}
