/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { TrSizes } from '@instana/legacy/types/components/Table/types';
import { Tr, Td, TrProps } from '@instana/legacy';

import { ColumnDefinition, TableProps } from 'in-components/tables/ServerTable/types';

import locals from './Row.mless';

interface RowProps<
  ItemType extends Object,
  AdditionalColumnPropsType extends TableProps<ItemType> = TableProps<ItemType>
> {
  item: ItemType;
  size?: keyof typeof TrSizes;
  columnDefinitions: ColumnDefinition<ItemType>[];
  getRowProps?: (item: ItemType) => TrProps;
  cellOpts: AdditionalColumnPropsType;
  onRowClick?: (item: ItemType, e: React.MouseEvent) => void;
  onMouseEnter: (item: ItemType) => void;
  onMouseLeave: (item: ItemType) => void;
}

export default function Row<
  ItemType extends Object,
  AdditionalColumnPropsType extends TableProps<ItemType> = TableProps<ItemType>
>({
  item,
  size,
  columnDefinitions,
  getRowProps,
  onRowClick,
  cellOpts,
  onMouseEnter,
  onMouseLeave
}: RowProps<ItemType, AdditionalColumnPropsType>) {
  const rowProps = getRowProps ? getRowProps(item) : {};
  const rowClickHandler = onRowClick ? { onClick: (e: React.MouseEvent) => onRowClick(item, e) } : {};

  return (
    <Tr
      onMouseEnter={() => onMouseEnter(item)}
      onMouseLeave={() => onMouseLeave(item)}
      size={size}
      {...rowClickHandler}
      {...rowProps}
    >
      {columnDefinitions.map(
        ({ id, noWrap, ellipsis, cellClassName, tableAction, useMinimumAmountOfHorizontalSpace, getContent }) => (
          <Td
            key={id}
            noWrap={noWrap}
            ellipsis={ellipsis}
            useMinimumAmountOfHorizontalSpace={useMinimumAmountOfHorizontalSpace}
            className={classNames({
              [cellClassName as any]: cellClassName,
              [locals.tableActionCell]: tableAction,
              [locals.clickable]: onRowClick
            })}
          >
            {getContent(item, cellOpts, id)}
          </Td>
        )
      )}
    </Tr>
  );
}
