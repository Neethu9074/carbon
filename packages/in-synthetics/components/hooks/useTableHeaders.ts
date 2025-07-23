/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useMemo } from 'react';

import {
  getEllipsisValue,
  getHeader,
  getSortDirection,
  getWidthInAbsoluteUnit,
  getWidthValue
} from 'in-synthetics/components/utils';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { ListItem } from 'in-synthetics/components/constants';

/**
 * Hook to transform column definitions into table headers
 */
export function useTableHeaders<ITEM_TYPE extends ListItem>(
  visibleColumns: ColumnDefinition<ITEM_TYPE>[],
  orderBy: string,
  orderDirection: string
) {
  return useMemo(() => {
    return visibleColumns.map((col, index) => ({
      key: col?.id || String(index),
      header: getHeader(col) ?? '',
      isSortable: col.sortable ?? true,
      getContent: col.getContent,
      sortDirection: getSortDirection(col?.id, orderBy, orderDirection),
      defaultOrderDirection: col.defaultOrderDirection,
      noWrap: col.noWrap ?? false,
      ellipsis: getEllipsisValue(col.ellipsis, col.width),
      width: getWidthValue(col.ellipsis, col.width),
      useMinimumAmountOfHorizontalSpace: col.useMinimumAmountOfHorizontalSpace ?? false,
      widthInAbsoluteUnit: getWidthInAbsoluteUnit(col.ellipsis, col.widthInAbsoluteUnit) ?? false,
      selectAllCheckbox: col.selectAllCheckbox ?? false
    }));
  }, [visibleColumns, orderBy, orderDirection]);
}
