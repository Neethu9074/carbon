/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { ReactNode } from 'react';

import { OrderDirection, TimeConfig } from '@instana/types';
import { Observable } from '@instana/observables';

import { ServerTableUrlState } from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import { ColumnDefinition, TableProps } from 'in-components/tables/ServerTable/types';
import { ParameterDefinition } from 'in-stores/navigation/types';
import { Nullish, PaginatedResult, Result } from 'in-types';

export type Ellipsis = string | boolean | undefined;
export type Width = string | number | undefined;

export interface ListItem extends Object {
  id?: string;
}

export interface SyntheticDataTableWithUrlStateProps<
  ITEM_TYPE extends ListItem,
  PROPS_TYPE extends TableProps<ITEM_TYPE>
> {
  paginationResettingUrlParameters: readonly ParameterDefinition<any>[];
  columnDefinitions: ColumnDefinition<ITEM_TYPE, PROPS_TYPE>[];
  get: (data: any) => Observable<Result<PaginatedResult<ITEM_TYPE>>>;
  defaultOrderBy: string;
  defaultOrderDirection?: OrderDirection;
  defaultPageSize?: number;
  defaultPageSizes?: number[];
  defaultQuery?: string;
  pathSegment: string;
  matrixPrefix: string;
  timeConfig: TimeConfig;
}

export interface SyntheticDataTablePresenterProps<ITEM_TYPE extends ListItem, PROPS_TYPE extends TableProps<ITEM_TYPE>>
  extends SyntheticDataTableWithUrlStateProps<ITEM_TYPE, PROPS_TYPE>,
    ServerTableUrlState {
  result: Result<PaginatedResult<ITEM_TYPE>> | Nullish;
  onChange: (change: Partial<ServerTableUrlState>) => void;
}

export interface CarbonHeader<ITEM_TYPE extends ListItem, PROPS_TYPE extends TableProps<ITEM_TYPE>> {
  key: string;
  header: string | ReactNode;
  isSortable?: boolean;
  getContent: ColumnDefinition<ITEM_TYPE, PROPS_TYPE>['getContent'];
  sortDirection?: OrderDirection | 'NONE';
  defaultOrderDirection?: OrderDirection;
  noWrap?: boolean;
  ellipsis?: boolean;
  width?: string | number;
  useMinimumAmountOfHorizontalSpace?: boolean;
  widthInAbsoluteUnit?: boolean;
  selectAllCheckbox?: boolean;
}

export interface CarbonRow {
  id: string;
  [key: string]: string;
}
