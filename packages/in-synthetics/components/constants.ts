/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { ReactNode } from 'react';

import { OrderDirection, PaginatedResult, Result } from '@instana/types';
import { Observable } from '@instana/observables';

import { ServerTableUrlState } from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { ParameterDefinition } from 'in-stores/navigation/types';

export type Ellipsis = string | boolean | undefined;
export type Width = string | number | undefined;

export interface ListItem extends Object {
  id?: string;
}

interface UrlStateParams {
  pathSegment: string;
  matrixPrefix: string;
  defaultOrderBy: string;
  defaultOrderDirection?: OrderDirection;
  defaultPageSize?: number;
  defaultPageSizes?: number[];
  defaultQuery?: string;
  defaultDisabledColumns?: readonly string[];
  paginationResettingUrlParameters?: readonly ParameterDefinition<any>[];
}

export interface TableState {
  page: number;
  orderDirection: OrderDirection;
  onChange: (s: Partial<TableState>) => void;
  pageSize: number;
  pageSizes?: Array<number>;
  query?: string;
  orderBy: string;
  disabledColumns?: string[];
  enabledColumns?: string[];
}

export type CarbonDataTableWithUrlStateProps<
  ITEM_TYPE extends ListItem,
  ADDITIONAL_PROPS extends Object
> = UrlStateParams &
  ADDITIONAL_PROPS & {
    columnDefinitions: ColumnDefinition<ITEM_TYPE>[];
    get: (data: any) => Observable<Result<PaginatedResult<ITEM_TYPE>>>;
    isSearchable?: boolean;
    searchText?: string;
    noDataHeader?: string;
    noDataDescription?: string;
    errorHeader?: string;
    toolBarContent?: JSX.Element | boolean;
    actionButtonContent?: JSX.Element | boolean;
    isFilterable?: boolean;
    filters?: JSX.Element | null;
    onFilterApply?: () => void;
    onFilterCancel?: () => void;
    loading?: boolean;
  };

export interface CarbonDataTablePresenterProps<ITEM_TYPE extends ListItem> {
  columnDefinitions: ColumnDefinition<ITEM_TYPE>[];
  result: Result<PaginatedResult<ITEM_TYPE>>;
  optionalColumns?: ColumnDefinition<ITEM_TYPE>[];
  getRowDetails?: ((result: any) => ReactNode) | ReactNode;
  loading?: boolean;
}

export interface CarbonHeader<ITEM_TYPE extends ListItem> {
  key: string;
  header: string | ReactNode;
  isSortable?: boolean;
  getContent?: ColumnDefinition<ITEM_TYPE>['getContent'];
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

export interface CarbonDataTableProps<ITEM_TYPE extends ListItem> {
  rows: CarbonRow[];
  headers: CarbonHeader<ITEM_TYPE>[];
  isLoading?: boolean;
  query?: string;
  isSearchable?: boolean;
  searchText?: string;
  isExpandable?: boolean;
  isSelectable?: boolean;
  getBatchActionItems?: () => Readonly<BatchActionItemProps[]>;
  toolBarContent?: JSX.Element | boolean;
  configureColumnContent?: JSX.Element | boolean;
  actionButtonContent?: JSX.Element | boolean;
  searchRows?: (value: React.ChangeEvent<HTMLInputElement>) => void;
  sortRow?: (sortState: { sortDirection: string; sortHeaderKey: string }) => void;
  errorContent?: JSX.Element | boolean;
  noDataHeader?: string;
  noDataDescription?: string;
  errorHeader?: string;
  result: Result<PaginatedResult<ITEM_TYPE>>;
  page: number;
  isFilterable?: boolean;
  filters?: JSX.Element;
  onFilterApply?: () => void;
  onFilterCancel?: () => void;
  fixedLayout?: boolean;
}

export interface ConfigureColumnsProps<ITEM_TYPE extends ListItem> {
  columnDefinitions: ColumnDefinition<ITEM_TYPE>[];
  visibleColumns: ColumnDefinition<ITEM_TYPE>[];
  disabledColumns: string[];
  isResultLoading?: boolean;
  onSubmit: (change: Partial<ServerTableUrlState>) => void;
}

export interface ConfigureColumnsTearsheetProps<ITEM_TYPE extends ListItem> extends ConfigureColumnsProps<ITEM_TYPE> {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface Cell {
  id: string;
  value: string | CellValue;
  isEditable: boolean;
  isEditing: boolean;
  isValid: boolean;
  errors: null | Array<Error>;
  info: {
    header: string;
  };
}

export interface CellValue {
  id: string;
  optional?: boolean;
  isChecked?: boolean;
}

export interface Row {
  id: string;
  cells: Cell[];
  disabled?: boolean;
  isExpanded?: boolean;
  isSelected?: boolean;
}

export interface ColumnState {
  id: string;
  visible: boolean;
  optional?: boolean;
}

export type SortDirectionType = 'NONE' | OrderDirection;

export interface Option {
  label: string;
  value: string;
}

export type FilterId = 'type' | 'location' | 'association' | 'application';

export type SelectionProps =
  | {
      checked?: boolean;
      onSelect: any;
      id: string;
      name: string;
      ariaLabel: any;
      'aria-label': any;
      disabled?: boolean;
      radio?: boolean;
    }
  | {
      ariaLabel: any;
      'aria-label': any;
      checked: boolean;
      id: string;
      indeterminate: boolean;
      name: string;
      onSelect: any;
    };
