/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useMemo } from 'react';
import classNames from 'classnames';

import { Result, PaginatedResult } from '@instana/types';

import { ListItem, CarbonHeader, TableState, CarbonDataTablePresenterProps } from 'in-synthetics/components/constants';
import { getRowId } from 'in-synthetics/components/utils';

import locals from 'in-synthetics/components/CarbonDataTablePresenter.mless';

/**
 * Hook to transform data items into table rows
 */
export function useTableRows<ITEM_TYPE extends ListItem>(
  result: Result<PaginatedResult<ITEM_TYPE>>,
  headers: CarbonHeader<ITEM_TYPE>[],
  props: CarbonDataTablePresenterProps<ITEM_TYPE> & TableState,
  getRowDetails?: ((item: ITEM_TYPE) => React.ReactNode) | React.ReactNode
) {
  return useMemo(() => {
    if (!result?.data?.items) return [];

    return result.data.items.map((item: ITEM_TYPE, index: number) => {
      const rowId = item.id ?? getRowId(item) ?? String(index);
      const expanded = typeof getRowDetails === 'function' ? getRowDetails(item) : undefined;

      const cells = headers.map(({ key, getContent, ellipsis, noWrap, useMinimumAmountOfHorizontalSpace }) => {
        const cellContent = getContent?.(item, props, key);

        // If ellipsis is a string (width value) or true with width defined
        if (typeof ellipsis !== 'boolean') {
          return {
            [key]: (
              <div
                className={classNames({
                  [locals.tableTdNoWrap]: noWrap,
                  [locals.tableMinimumHorizontalSpace]: useMinimumAmountOfHorizontalSpace
                })}
              >
                {cellContent}
              </div>
            )
          };
        }

        return { [key]: cellContent };
      });

      return Object.assign({}, ...cells, { id: rowId }, { expanded });
    });
  }, [result?.data?.items, headers, getRowDetails, props]);
}
