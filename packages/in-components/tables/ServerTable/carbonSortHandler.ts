/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { ListItem, ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import { CarbonHeader } from 'in-components/tables/ServerTable/ServerTablePresenter';
import { TableState } from 'in-components/tables/ServerTable/types';

/**
 * Adapter for carbon sorting to be used with instana ColumnDefinition based tables.
 *
 * Used in ServerTablePresenter.
 *
 * It creates a new function, to be used as a {sortRow} function in a CarbonDataTable
 *
 * @param carbonHeaders headers, used to find the default sort order of a column
 * @param onChange the callback used with the new sorting state
 * @param query the query state (derived from current state?)
 * @param pageSize the pageSize state (derived from current state?)
 * @param pageSizes the pageSizes state (derived from current state?)
 */
export function carbonSortHandler<ItemType extends ListItem, PropsType extends ServerTablePresenterProps<ItemType>>(
  carbonHeaders: CarbonHeader<ItemType, PropsType>[],
  onChange: {
    (sortState: Partial<TableState>): void;
  },
  query: string | undefined,
  pageSize: number,
  pageSizes: number[] | undefined
): (sortState: { sortDirection: string; sortHeaderKey: string }) => void {
  return (sortState: { sortHeaderKey: string; sortDirection: string }) => {
    let orderBy = sortState.sortHeaderKey;
    let orderDirection: 'ASC' | 'DESC';

    // When switching column, the initial direction is NONE
    if (sortState.sortDirection === 'NONE') {
      // pick the column's default order
      // or
      // use a fallback value of ASC, because
      // backend APIs as of now doesn't support NONE as a sort direction option,
      // so will try to maintain the current? behaviour.
      const selectedColumnHeader = carbonHeaders.find(header => header.key === orderBy);
      orderDirection = selectedColumnHeader?.defaultOrderDirection ?? 'ASC';
    } else if (sortState.sortDirection === 'ASC') {
      orderDirection = 'DESC';
    } else if (sortState.sortDirection === 'DESC') {
      orderDirection = 'ASC';
    } else {
      // default, to enable strict typing of orderDirection
      orderDirection = 'ASC';
    }
    onChange({ query, orderBy, orderDirection, page: 1, pageSize, pageSizes });
  };
}
