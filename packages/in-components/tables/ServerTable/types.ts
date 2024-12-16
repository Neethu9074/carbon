/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import { TrSizes } from '@instana/legacy/types/components/Table/types';
import { ThProps, TrProps } from '@instana/legacy';

import { OrderDirection } from 'in-types';

export interface ColumnDefinition<
  ItemType extends Object,
  AdditionalContentPropsType extends TableProps<ItemType> = TableProps<ItemType>
> {
  id: string;
  width?: string | number;
  widthInAbsoluteUnit?: boolean;
  useMinimumAmountOfHorizontalSpace?: boolean;
  sortable?: boolean;
  optional?: boolean;
  noWrap?: boolean;
  ellipsis?: string | boolean;
  selectAllCheckbox?: boolean;
  defaultDisabled?: boolean;
  defaultOrderDirection?: OrderDirection;
  getContent(item: ItemType, additionalContentProps: AdditionalContentPropsType, columnId: string): React.ReactNode;
  label: string;
  renderLabel?: (definition: ColumnDefinition<ItemType>) => React.ReactNode;
  headCellProps?: Omit<ThProps, 'width' | 'widthInAbsoluteUnit' | 'useMinimumAmountOfHorizontalSpace'>;
  cellClassName?: string;
  tableAction?: unknown;
}

export interface TableState {
  page: number;
  numPages: number;
  totalItems: number;
  orderDirection: OrderDirection;
  onChange: (s: Partial<TableState>) => void;
  pageSize: number;
  pageSizes?: Array<number>;
  query?: string;
  orderBy: string;
  disabledColumns?: string[];
  enabledColumns?: string[];
}

export interface TableProps<ItemType extends Object> {
  columnDefinitions: ColumnDefinition<ItemType, this>[];
  disabledColumns?: string[];
  enabledColumns?: string[];
  orderBy: string;
  orderDirection: OrderDirection;

  getRowProps?: (item: ItemType) => TrProps;
  onRowClick?: (item: ItemType, e: React.MouseEvent) => void;

  numSkeletonRows?: number;

  size?: keyof typeof TrSizes;
  cardTitle?: string;
  tableInCard?: boolean;
  noDataMessage?: string;
  renderNoDataAvailable?: (message?: string) => React.ReactNode;
  allRowsAreSelected?: boolean;
  setSelectedStateForRows?: (allRowsAreSelected: boolean) => void;

  onChange?: (s: Partial<TableState>) => void;
  onRowMouseEnter?: (item: ItemType) => void;
  onRowMouseLeave?: (item: ItemType) => void;
}
