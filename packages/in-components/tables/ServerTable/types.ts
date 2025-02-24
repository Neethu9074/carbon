/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React, { DetailedHTMLProps, HTMLAttributes, ReactNode, CSSProperties } from 'react';

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

export enum TrSizes {
  compact,
  minimal,
  regular
}

export type TrProps = {
  className?: string;
  depth?: 1 | 2;
  size?: keyof typeof TrSizes;
  active?: boolean;
  dull?: boolean;
  selected?: boolean;
} & DetailedHTMLProps<HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>;

export type ThProps = {
  children?: ReactNode;
  style?: CSSProperties;
  width?: number | string;
  widthInAbsoluteUnit?: boolean;
  wrapContent?: (e: ReactNode) => {};
  className?: string;
  noWrap?: boolean;
  useMinimumAmountOfHorizontalSpace?: boolean;
};
