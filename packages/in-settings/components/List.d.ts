/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { ReactNode } from 'react';

import { Observable } from '@instana/observables';

export interface TableActions<ItemType extends Object> {
  deselect?: {
    deselect: (entity: ItemType) => void;
  };
  delete?: {
    deleteEntity: (entity: ItemType) => Observable<any>;
  };
}

interface ColumnDefinition<ItemType extends Object> {
  id: number | string;
  label: string;
  getContent: (entity: ItemType) => ReactNode;
}

interface ListProps<ItemType extends Object> {
  className?: string;
  title?: ReactNode;
  noDataMessage?: string;
  pageSize?: number;
  initialOrderBy?: string;
  isSearchable?: boolean;
  loadEntities: () => Observable<ItemType[]>;
  columnDefinitions: ColumnDefinition<ItemType>[];
  getHeader?: (
    totalHitsBeforeFilter: number,
    totalHitsAfterFilter: number,
    entitiesBeforePagination: number
  ) => ReactNode;
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
}

declare function ListComponent<ItemType extends Object>(props: ListProps<ItemType>): JSX.Element;

export declare function leftHeaderWithSelectAll(
  entityName: string,
  inSelectListDialog: boolean,
  tableActions: TableActions<ItemType>,
  isBeta?: boolean
): (totalHitsBeforeFilter: number, totalHitsAfterFilter: number, entitiesBeforePagination: number) => ReactNode;

export declare function createNewEntityButton({
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
}): ReactNode;

export default ListComponent;
