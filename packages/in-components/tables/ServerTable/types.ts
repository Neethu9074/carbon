/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import { ThProps } from '@instana/components';

import { OrderDirection } from 'in-types';

export interface ColumnDefinition<ItemType extends Object, AdditionalContentPropsType = unknown> {
  id: string;
  width: string;
  widthInAbsoluteUnit?: boolean;
  useMinimumAmountOfHorizontalSpace?: boolean;
  sortable?: boolean;
  optional?: boolean;
  noWrap?: boolean;
  ellipsis?: string | boolean;
  selectAllCheckbox?: boolean;
  defaultOrderDirection?: OrderDirection;
  getContent(item: ItemType, additionalContentProps: AdditionalContentPropsType, columnId: string): React.ReactNode;
  label: string;
  renderLabel?: (definition: ColumnDefinition<ItemType>) => React.ReactNode;
  headCellProps?: Omit<ThProps, 'width' | 'widthInAbsoluteUnit' | 'useMinimumAmountOfHorizontalSpace'>;
  cellClassName?: string;
  tableAction?: unknown;
}
