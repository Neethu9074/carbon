import React from 'react';

import { Tr, Th, SortableTh } from 'in-components/tables/sharedComponents';
import { joinClassNames } from 'in-services/util/classnames';
import CheckboxFancy from 'in-components/form/CheckboxFancy';

import locals from './Columns.mless';

export default function Columns({
  setOrder,
  orderBy,
  orderDirection,
  columnDefinitions,
  allRowsAreSelected,
  setSelectedStateForRows
}) {
  return (
    <Tr size="compact">
      {columnDefinitions.map(columnDefinition => {
        const label = columnDefinition.label || null;
        const headCellProps = columnDefinition.headCellProps ? columnDefinition.headCellProps : {};
        if (columnDefinition.tableAction) {
          headCellProps.className = joinClassNames(headCellProps.className, locals.tableActionHead);
        }
        headCellProps.width = columnDefinition.width;

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
        if (columnDefinition.sortable === false || columnDefinition.tableAction) {
          return (
            <Th key={columnDefinition.id} {...headCellProps}>
              {label}
            </Th>
          );
        }

        const isSortedByThisColumn = orderBy === columnDefinition.id;
        return (
          <SortableTh
            key={columnDefinition.id}
            {...headCellProps}
            isSortedByThisColumn={isSortedByThisColumn}
            sortDirection={orderDirection}
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();

              setOrder(
                columnDefinition.id,
                getOrderDirection(isSortedByThisColumn, orderDirection, columnDefinition.defaultOrderDirection)
              );
            }}
          >
            {label}
          </SortableTh>
        );
      })}
    </Tr>
  );
}

function getOrderDirection(isAlreadyOrderedBy, currentOrderDirection, defaultOrderDirection = 'ASC') {
  if (!isAlreadyOrderedBy) {
    return defaultOrderDirection;
  }
  return currentOrderDirection === 'ASC' ? 'DESC' : 'ASC';
}
