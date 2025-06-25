/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import classNames from 'classnames';
import { debounce } from 'lodash';
import React from 'react';

import { Pagination as CarbonPagination } from '@instana/components';

import {
  getEllipsisValue,
  getFromLocalStorage,
  getHeader,
  getSortDirection,
  getVisibleColumns,
  getWidthInAbsoluteUnit,
  getWidthValue,
  sortHandler
} from 'in-synthetics/components/utils';
import { CarbonHeader, CarbonRow, ListItem, CarbonDataTablePresenterProps } from 'in-synthetics/components/constants';
import { ColumnDefinition, TableProps } from 'in-components/tables/ServerTable/types';
import { ConfigureColumns } from 'in-synthetics/components/ConfigureColumns';
import { CarbonDataTable } from 'in-synthetics/components/CarbonDataTable';
import { noop, pendingResult } from 'in-services/fixedObjects';
import { isLoading } from 'in-services/util/result';
import { PaginatedResult, Result } from 'in-types';
import { tryGet } from 'in-services/localStorage';

import locals from './CarbonDataTablePresenter.mless';

export default function CarbonDataTablePresenter<ITEM_TYPE extends ListItem, PROPS_TYPE extends TableProps<ITEM_TYPE>>(
  props: CarbonDataTablePresenterProps<ITEM_TYPE, PROPS_TYPE>
) {
  const {
    query,
    page,
    orderBy,
    orderDirection,
    pageSize,
    pageSizes,
    onChange = noop,
    columnDefinitions,
    getRowDetails,
    optionalColumns = [],
    disabledColumns,
    enabledColumns
  } = props;
  let defaultPageSize = pageSizes?.[0] ?? pageSize;
  let columnDefinitionsParsed = getFromLocalStorage<ColumnDefinition<ITEM_TYPE, PROPS_TYPE>[]>(
    'columnDefinitions',
    columnDefinitions
  );
  const rawColumnDefinitions = tryGet('columnDefinitions');
  if (rawColumnDefinitions) {
    // restoring getContent() to each column in the parsed columnDefinitions from local storage
    columnDefinitionsParsed = columnDefinitionsParsed.map(colDef => {
      const original = columnDefinitions.find(def => def.id === colDef.id);
      return {
        ...original,
        ...colDef
      };
    });
  }
  const disabledColumnsParsed = getFromLocalStorage<string[]>('disabledColumns', disabledColumns);
  const enabledColumnsParsed = getFromLocalStorage<string[]>('enabledColumns', enabledColumns);

  let visibleColumns: ColumnDefinition<ITEM_TYPE, PROPS_TYPE>[] = getVisibleColumns(
    columnDefinitionsParsed,
    optionalColumns,
    disabledColumnsParsed,
    enabledColumnsParsed
  );

  const result = props.result ?? (pendingResult as Result<PaginatedResult<ITEM_TYPE>>);

  const debounceOnChange = debounce((searchInput: string) => {
    if (searchInput !== undefined) {
      onChange({ query: searchInput, orderBy, orderDirection, page: 1, pageSize, pageSizes });
    }
  }, 500);

  const filterRows = (searchInputText: string) => {
    debounceOnChange(searchInputText);
  };

  const carbonHeaders: CarbonHeader<ITEM_TYPE, PROPS_TYPE>[] = visibleColumns.map(
    (item: ColumnDefinition<ITEM_TYPE, PROPS_TYPE>, i: number) => ({
      key: item?.id || String(i),
      header: getHeader(item) ?? '',
      isSortable: item.sortable ?? true,
      getContent: item.getContent,
      sortDirection: getSortDirection(item?.id, orderBy, orderDirection),
      defaultOrderDirection: item.defaultOrderDirection,
      noWrap: item.noWrap ?? false,
      ellipsis: getEllipsisValue(item.ellipsis, item.width),
      width: getWidthValue(item.ellipsis, item.width),
      useMinimumAmountOfHorizontalSpace: item.useMinimumAmountOfHorizontalSpace ?? false,
      widthInAbsoluteUnit: getWidthInAbsoluteUnit(item.ellipsis, item.widthInAbsoluteUnit) ?? false,
      selectAllCheckbox: item.selectAllCheckbox ?? false
    })
  );

  const loading = isLoading(result);

  const carbonRows: CarbonRow[] =
    result.data?.items.map((item: ITEM_TYPE, index: number) => {
      const idObj = { id: item.id ?? String(index) };
      const expandedObj = {
        expanded: typeof getRowDetails === 'function' ? getRowDetails(item) : undefined
      };

      const newRow = carbonHeaders.map(({ key, getContent, ellipsis, noWrap, useMinimumAmountOfHorizontalSpace }) => {
        const newWidth = typeof ellipsis !== 'boolean' ? ellipsis : null;
        const content = newWidth
          ? {
              [key]: (
                <div
                  className={classNames({
                    [locals.tableTdNoWrap]: noWrap,
                    [locals.tableMinimumHorizontalSpace]: useMinimumAmountOfHorizontalSpace
                  })}
                >
                  {getContent?.(item, props as unknown as PROPS_TYPE, key)}
                </div>
              )
            }
          : { [key]: getContent?.(item, props as unknown as PROPS_TYPE, key) };
        return content;
      });
      const carbonRow: CarbonRow = Object.assign({}, ...newRow, idObj, expandedObj);
      return carbonRow;
    }) ?? [];

  const sortRow = sortHandler(carbonHeaders, onChange, pageSize, query, pageSizes);
  const isConfigurationColumn = optionalColumns && optionalColumns.length ? true : false;

  return (
    <>
      <CarbonDataTable
        rows={carbonRows}
        headers={carbonHeaders}
        isLoading={loading}
        filterRows={e => filterRows(e?.target?.value)}
        sortRow={sortRow}
        configureColumnContent={
          isConfigurationColumn && (
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
      {result.data && result.data.totalHits > defaultPageSize && (
        <CarbonPagination
          currentPage={page}
          totalItems={result?.data?.totalHits}
          pageSize={pageSize}
          pageSizes={pageSizes ?? [pageSize]}
          onChange={data => {
            onChange({ query, orderBy, orderDirection, page: data.page, pageSize: data.pageSize, pageSizes });
          }}
        />
      )}
    </>
  );
}
