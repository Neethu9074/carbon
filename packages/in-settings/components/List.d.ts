/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { ReactNode, ReactElement } from 'react';

import { Observable } from '@instana/observables';

import { ColumnDefinition as ServerTableColumnDefinition } from 'in-components/tables/ServerTable/types';

export interface TableActions<ItemType extends Object> {
  select?: {
    select: (entity: ItemType) => void;
    title?: (entity: ItemType) => string;
  };
  deselect?: {
    deselect: (entity: ItemType) => void;
  };
  delete?: {
    deleteEntity: (entity: ItemType) => Observable<any>;
  };
}

export interface ColumnDefinition<ItemType extends Object> extends ServerTableColumnDefinition<ItemType> {
  getValue?: (entity: ItemType) => any;
  label?: string;
}

interface ListProps<ItemType extends Object> {
  withBottomPadding?: boolean;
  title?: ReactNode;
  noDataMessage?: string;
  pageSize?: number;
  initialOrderBy?: string;
  isSearchable?: boolean;
  loadEntities: () => Observable<ItemType[]>;
  columnDefinitions: ColumnDefinition<ItemType>[];
  searchWidth?: number;
  getHeader?: (
    totalHitsBeforeFilter: number,
    totalHitsAfterFilter: number,
    entitiesBeforePagination: number
  ) => ReactNode;
  getCustomHeader?: () => ReactElement;
  searchAttributes?: string | ((entity: ItemType) => string) | (string | ((entity: ItemType) => string))[];
  searchPlaceholder?: string;
  searchMaxWidth?: number;
  extraFilters?: Array<(element: ItemType, index: number, array: ItemType[]) => boolean>;
  rightHeader?: ReactNode;
  tableActions?: TableActions<ItemType>;
  getEntityName?: (element: ItemType) => string;
  initalOrderDir?: 'ASC' | 'DESC';
  customSortEntities?: ({
    entities,
    columnDefinitions,
    orderByState,
    orderDirectionState
  }: {
    entities: ItemType[];
    columnDefinitions: ColumnDefinition<ItemType>[];
    orderByState: keyof ItemType;
    orderDirectionState: 'ASC' | 'DESC';
  }) => ItemType[];
  onRowClick?: (entity: ItemType) => void;
  renderNoDataAvailable?: (message?: string) => React.ReactNode;
  onCreateNew?: () => void;
  onFilter?: (entities: any[]) => any[];
  onSearch?: (query: string) => void;
  labelNew?: string;
  customDialogMessage?: (entity: ItemType) => void;
  customDialogConfirmLabel?: string;
  customDeleteTooltipMessage?: (entity: ItemType) => string;
  boundedPath?: string;
}

declare function ListComponent<ItemType extends Object>(props: ListProps<ItemType>): JSX.Element;

export declare function leftHeaderWithSelectAll(
  entityName: string,
  inSelectListDialog: boolean,
  tableActions: TableActions<ItemType>,
  isBeta?: boolean
): (totalHitsBeforeFilter: number, totalHitsAfterFilter: number, entitiesBeforePagination: number) => ReactNode;

export declare function CreateNewEntityButton({
  labelNew,
  pathNew,
  onCreateNew,
  disabledMessage,
  trackEvent
}: {
  labelNew: string;
  pathNew: string;
  onCreateNew?: Function;
  disabledMessage?: string;
  trackEvent?: Function;
}): JSX.Element;

export default ListComponent;

export function reload(): void;

export function defaultHeaderWithCount(title: string): (totalHits: number, filteredHits: number) => string;

export function filterReducer(query: string, entity: any, foundMatch: boolean, searchAttribute: any): boolean;
