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
import { PaginatedResult, Result } from 'in-types';

export type Ellipsis = string | boolean | undefined;
export type Width = string | number | undefined;

export interface ListItem extends Object {
  id?: string;
}

export interface CarbonDataTableWithUrlStateProps<
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
  isSearchable?: boolean;
  searchText?: string;
  noDataHeader?: string;
  noDataDescription?: string;
  toolBarContent?: JSX.Element | boolean;
  actionButtonContent?: JSX.Element | boolean;
  query?: string;
  defaultDisabledColumns?: string[];
}

export interface CarbonDataTablePresenterProps<ITEM_TYPE extends ListItem, PROPS_TYPE extends TableProps<ITEM_TYPE>>
  extends CarbonDataTableWithUrlStateProps<ITEM_TYPE, PROPS_TYPE>,
    Omit<ServerTableUrlState, 'query'> {
  result: Result<PaginatedResult<ITEM_TYPE>>;
  optionalColumns?: ColumnDefinition<ITEM_TYPE, PROPS_TYPE>[];
  disabledColumns: string[];
  enabledColumns: string[];
  getRowDetails?: ((result: any) => ReactNode) | ReactNode;
  onChange: (change: Partial<ServerTableUrlState>) => void;
}

export interface CarbonHeader<ITEM_TYPE extends ListItem, PROPS_TYPE extends TableProps<ITEM_TYPE>> {
  key: string;
  header: string | ReactNode;
  isSortable?: boolean;
  getContent?: ColumnDefinition<ITEM_TYPE, PROPS_TYPE>['getContent'];
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

export interface BatchActionItemProps {
  renderIcon: React.ElementType<any> | undefined;
  actionName: string;
  actionType: string;
  onClick: (selectedIds: string[]) => JSX.Element;
}

export interface CarbonDataTableProps<ITEM_TYPE extends ListItem, PROPS_TYPE extends TableProps<ITEM_TYPE>> {
  rows: CarbonRow[];
  headers: CarbonHeader<ITEM_TYPE, PROPS_TYPE>[];
  isLoading: boolean;
  query?: string;
  isSearchable?: boolean;
  searchText?: string;
  isExpandable?: boolean;
  isSelectable?: boolean;
  getBatchActionItems?: () => Readonly<BatchActionItemProps[]>;
  toolBarContent?: JSX.Element | boolean;
  configureColumnContent?: JSX.Element | boolean;
  actionButtonContent?: JSX.Element | boolean;
  filterRows?: (value: React.ChangeEvent<HTMLInputElement>) => void;
  sortRow?: (sortState: { sortDirection: string; sortHeaderKey: string }) => void;
  errorContent?: JSX.Element | boolean;
  noDataHeader?: string;
  noDataDescription?: string;
  errorHeader?: string;
  result: Result<PaginatedResult<ITEM_TYPE>>;
}

export interface ConfigureColumnsProps<ITEM_TYPE extends ListItem, PROPS_TYPE extends TableProps<ITEM_TYPE>> {
  columnDefinitions: ColumnDefinition<ITEM_TYPE, PROPS_TYPE>[];
  visibleColumns: ColumnDefinition<ITEM_TYPE, PROPS_TYPE>[];
  disabledColumns: string[];
  isResultLoading?: boolean;
  onSubmit: (change: Partial<ServerTableUrlState>) => void;
}

export interface ConfigureColumnsTearsheetProps<ITEM_TYPE extends ListItem, PROPS_TYPE extends TableProps<ITEM_TYPE>>
  extends ConfigureColumnsProps<ITEM_TYPE, PROPS_TYPE> {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface CellValue {
  id: string;
  optional?: boolean;
  isChecked?: boolean;
}

export interface Row {
  id: string;
  cells: {
    id: string;
    info: {
      header: string;
    };
    value: string | CellValue;
  }[];
}

export interface ColumnState {
  id: string;
  visible: boolean;
  optional?: boolean;
}
