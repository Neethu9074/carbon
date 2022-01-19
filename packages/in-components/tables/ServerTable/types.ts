/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import { ThProps } from '@instana/components';

import { OrderDirection } from 'in-types';

export interface ColumnDefinition<ColumnPropsType extends Object> {
  id: string;
  width: string;
  widthInAbsoluteUnit?: boolean;
  useMinimumAmountOfHorizontalSpace?: boolean;
  sortable?: boolean;
  optional?: boolean;
  selectAllCheckbox?: boolean;
  defaultOrderDirection?: OrderDirection;
  getContent(props: ColumnPropsType): React.ReactNode;
  label: string;
  renderLabel?: (definition: ColumnDefinition<ColumnPropsType>) => React.ReactNode;
  headCellProps?: Omit<ThProps, 'width' | 'widthInAbsoluteUnit' | 'useMinimumAmountOfHorizontalSpace'>;
}
