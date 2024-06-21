/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { Checkbox } from '@instana/components';
import { Tr, Th, SortableTh, ThProps } from '@instana/legacy';

import ConfigurableTh from 'in-components/tables/sharedComponents/ConfigurableTh';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { OrderDirection } from 'in-types';

import locals from './Columns.mless';

type OrderSetter = (columnId: string, direction: OrderDirection) => void;

interface ColumnsProps<ItemType extends Object> {
  setOrder: OrderSetter;
  orderBy: string;
  orderDirection: OrderDirection;
  columnDefinitions: ColumnDefinition<ItemType>[];
  availableColumnDefinitions: ColumnDefinition<ItemType>[];
  onColumnChecked: (id: string, isEnabled: boolean) => void;
  optionalColumns?: unknown[];
  allRowsAreSelected?: boolean;
  setSelectedStateForRows?: (allRowsAreSelected: boolean) => void;
}

export default function Columns<ItemType extends Object>(props: ColumnsProps<ItemType>) {
  const {
    setOrder,
    orderBy,
    orderDirection,
    columnDefinitions,
    allRowsAreSelected,
    setSelectedStateForRows,
    optionalColumns
  } = props;
  return (
    <Tr size="minimal">
      {columnDefinitions.map((columnDefinition, i) => {
        const isLast = i === columnDefinitions.length - 1;
        const isConfigurationColum = optionalColumns && optionalColumns.length > 0 && isLast;
        const headCellProps = getHeadCellProps(columnDefinition);
        const isSortedByThisColumn = columnDefinition.sortable !== false && orderBy === columnDefinition.id;
        const label = columnDefinition.renderLabel
          ? columnDefinition.renderLabel(columnDefinition)
          : columnDefinition.label;

        if (columnDefinition.selectAllCheckbox) {
          // render toggle-all checkbox in thead
          return (
            <Th key={columnDefinition.id} {...headCellProps}>
              <Checkbox
                checked={allRowsAreSelected}
                onChange={() => setSelectedStateForRows?.(!allRowsAreSelected)}
                size="large"
              />
            </Th>
          );
        }

        if (isConfigurationColum) {
          return (
            <ConfigurableTh
              key={columnDefinition.id}
              {...props}
              {...headCellProps}
              isSortedByThisColumn={isSortedByThisColumn}
              sortDirection={orderDirection}
              onClick={e => onClick(e, setOrder, columnDefinition, isSortedByThisColumn, orderDirection)}
              sortable={columnDefinition.sortable}
            >
              {label}
            </ConfigurableTh>
          );
        }

        if (columnDefinition.sortable === false) {
          return (
            <Th key={columnDefinition.id} {...headCellProps}>
              {label}
            </Th>
          );
        }

        return (
          <SortableTh
            key={columnDefinition.id}
            {...headCellProps}
            isSortedByThisColumn={isSortedByThisColumn}
            sortDirection={orderDirection}
            onClick={e => onClick(e, setOrder, columnDefinition, isSortedByThisColumn, orderDirection)}
          >
            {label}
          </SortableTh>
        );
      })}
    </Tr>
  );
}

function onClick(
  e: React.MouseEvent<Element, MouseEvent>,
  setOrder: OrderSetter,
  columnDefinition: ColumnDefinition<any>,
  isSortedByThisColumn: boolean,
  orderDirection: OrderDirection
): void {
  stopPropagationAndPreventDefault(e);

  setOrder(
    columnDefinition.id,
    getOrderDirection(isSortedByThisColumn, orderDirection, columnDefinition.defaultOrderDirection)
  );
}

function getHeadCellProps(columnDefinition: ColumnDefinition<any>): ThProps {
  const className = classNames({
    [columnDefinition.headCellProps?.className as any]: columnDefinition.headCellProps?.className,
    [locals.th]: true
  });

  return {
    ...columnDefinition.headCellProps,
    className,
    width: columnDefinition.width,
    widthInAbsoluteUnit: columnDefinition.widthInAbsoluteUnit,
    useMinimumAmountOfHorizontalSpace: columnDefinition.useMinimumAmountOfHorizontalSpace
  };
}

function getOrderDirection(
  isAlreadyOrderedBy: boolean,
  currentOrderDirection: OrderDirection,
  defaultOrderDirection: OrderDirection = 'ASC'
): OrderDirection {
  if (!isAlreadyOrderedBy) {
    return defaultOrderDirection;
  }
  return currentOrderDirection === 'ASC' ? 'DESC' : 'ASC';
}
