/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import classNames from 'classnames';
import React from 'react';

import { Pagination as CarbonPagination } from '@instana/components';

import {
  getEllipsisValue,
  getHeader,
  getSortDirection,
  getWidthInAbsoluteUnit,
  getWidthValue
} from 'in-synthetics/components/utils';
import {
  CarbonHeader,
  CarbonRow,
  ListItem,
  SyntheticDataTablePresenterProps
} from 'in-synthetics/components/constants';
import { ColumnDefinition, TableProps } from 'in-components/tables/ServerTable/types';
import { SyntheticDataTable } from 'in-synthetics/components/SyntheticDataTable';
import { noop, pendingResult } from 'in-services/fixedObjects';
import { isLoading } from 'in-services/util/result';
import { PaginatedResult, Result } from 'in-types';

import locals from './SyntheticDataTablePresenter.mless';

export default function SyntheticDataTablePresenter<
  ITEM_TYPE extends ListItem,
  PROPS_TYPE extends TableProps<ITEM_TYPE>
>(props: SyntheticDataTablePresenterProps<ITEM_TYPE, PROPS_TYPE>) {
  const { query, page, orderBy, orderDirection, pageSize, pageSizes, onChange = noop, columnDefinitions } = props;
  let defaultPageSize = pageSizes?.[0] ?? pageSize;
  const result = props.result ?? (pendingResult as Result<PaginatedResult<ITEM_TYPE>>);

  const carbonHeaders: CarbonHeader<ITEM_TYPE, PROPS_TYPE>[] = columnDefinitions.map(
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
                  {getContent(item, props as unknown as PROPS_TYPE, key)}
                </div>
              )
            }
          : { [key]: getContent(item, props as unknown as PROPS_TYPE, key) };
        return content;
      });
      const carbonRow: CarbonRow = Object.assign({}, ...newRow, idObj);
      return carbonRow;
    }) ?? [];

  return (
    <>
      <SyntheticDataTable rows={carbonRows} headers={carbonHeaders} isLoading={loading} {...props} />
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
