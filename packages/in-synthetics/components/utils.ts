/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { OrderDirection } from '@instana/types';

import { ColumnDefinition, TableProps, TableState } from 'in-components/tables/ServerTable/types';
import { CarbonHeader, Ellipsis, ListItem, Width } from 'in-synthetics/components/constants';
import { tryGet } from 'in-services/localStorage';

export const getEllipsisValue = (ellipsis: Ellipsis, width: Width) => {
  if (typeof ellipsis === 'string' || (width !== 'undefined' && ellipsis !== undefined)) {
    ellipsis = true;
  }
  ellipsis ??= false;
  return ellipsis;
};

export const getWidthValue = (ellipsis: Ellipsis, width: Width) => {
  if (typeof ellipsis === 'string') {
    width = ellipsis;
  }
  return width;
};

export const getWidthInAbsoluteUnit = (ellipsis: Ellipsis, widthInAbsoluteUnit: boolean | undefined) => {
  if (typeof ellipsis === 'string') {
    widthInAbsoluteUnit = true;
  }
  return widthInAbsoluteUnit;
};

export const getHeader = <ITEM_TYPE extends ListItem, PROPS_TYPE extends TableProps<ITEM_TYPE>>(
  item: ColumnDefinition<ITEM_TYPE, PROPS_TYPE>
) => {
  if (item.renderLabel) {
    const label = typeof item.label === 'string' ? ({ data: item.label } as unknown as string) : item.label;
    return item.renderLabel({ ...item, label });
  }
  return item.label;
};

export const getSortDirection = (id: string, orderBy: string, orderDirection: string) => {
  let sortDirection: 'ASC' | 'DESC' | 'NONE';

  if (id === orderBy) {
    sortDirection = orderDirection === 'ASC' ? 'ASC' : 'DESC';
  } else {
    sortDirection = 'NONE';
  }
  return sortDirection;
};

export const getNextSortDirection = (
  prevHeader: string,
  header: string,
  prevState: string
): OrderDirection | 'NONE' => {
  if (prevHeader !== header) return 'ASC';

  switch (prevState) {
    case 'NONE':
      return 'ASC';
    case 'ASC':
      return 'DESC';
    case 'DESC':
      return 'NONE';
    default:
      return 'ASC';
  }
};

export function sortHandler<ITEM_TYPE extends ListItem, PROPS_TYPE extends TableProps<ITEM_TYPE>>(
  carbonHeaders: CarbonHeader<ITEM_TYPE, PROPS_TYPE>[],
  onChange: (sortState: Partial<TableState>) => void,
  pageSize: number,
  query?: string,
  pageSizes?: number[]
): (sortState: { sortDirection: string; sortHeaderKey: string }) => void {
  return (sortState: { sortHeaderKey: string; sortDirection: string }) => {
    let orderBy = sortState.sortHeaderKey;
    let orderDirection: 'ASC' | 'DESC';
    if (sortState.sortDirection === 'NONE') {
      const selectedColumnHeader = carbonHeaders.find(header => header.key === orderBy);
      orderDirection = selectedColumnHeader?.defaultOrderDirection ?? 'ASC';
    } else if (sortState.sortDirection === 'ASC') {
      orderDirection = 'DESC';
    } else if (sortState.sortDirection === 'DESC') {
      orderDirection = 'ASC';
    } else {
      orderDirection = 'ASC';
    }
    onChange({ query, orderBy, orderDirection, page: 1, pageSize, pageSizes });
  };
}

export function getVisibleColumns<ITEM_TYPE extends ListItem, PROPS_TYPE extends TableProps<ITEM_TYPE>>(
  columnDefinitions: ColumnDefinition<ITEM_TYPE, PROPS_TYPE>[],
  optionalColumns: ColumnDefinition<ITEM_TYPE, PROPS_TYPE>[],
  disabledColumns: string[],
  enabledColumns: string[]
) {
  const hasOptionalColumns = optionalColumns?.length > 0;

  if (!hasOptionalColumns) {
    return columnDefinitions;
  }

  return columnDefinitions.filter(def => {
    const isDisabled = disabledColumns.includes(def.id);
    const isEnabledExplicitly = enabledColumns.includes(def.id);
    const isDefaultDisabled = !!def.defaultDisabled;

    return !isDisabled && (!isDefaultDisabled || isEnabledExplicitly);
  });
}

export function getFromLocalStorage<T>(key: string, fallback: T): T {
  try {
    const raw = tryGet(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
