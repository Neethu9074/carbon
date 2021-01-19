/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import classNames from 'classnames';
import React from 'react';

import { Tr, Th, SortableTh, ConfigurableTh } from 'in-components/tables/sharedComponents';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import CheckboxFancy from 'in-components/form/CheckboxFancy';

import locals from './Columns.mless';

export default function Columns(props) {
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
              <CheckboxFancy
                checked={allRowsAreSelected}
                onChange={() => setSelectedStateForRows(!allRowsAreSelected)}
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

function onClick(e, setOrder, columnDefinition, isSortedByThisColumn, orderDirection) {
  stopPropagationAndPreventDefault(e);

  setOrder(
    columnDefinition.id,
    getOrderDirection(isSortedByThisColumn, orderDirection, columnDefinition.defaultOrderDirection)
  );
}

function getHeadCellProps(columnDefinition) {
  const headCellProps = columnDefinition.headCellProps ? columnDefinition.headCellProps : {};
  headCellProps.className = classNames({
    [headCellProps.className]: headCellProps.className,
    [locals.th]: true
  });
  headCellProps.width = columnDefinition.width;
  headCellProps.widthInAbsoluteUnit = columnDefinition.widthInAbsoluteUnit;
  return headCellProps;
}

function getOrderDirection(isAlreadyOrderedBy, currentOrderDirection, defaultOrderDirection = 'ASC') {
  if (!isAlreadyOrderedBy) {
    return defaultOrderDirection;
  }
  return currentOrderDirection === 'ASC' ? 'DESC' : 'ASC';
}
