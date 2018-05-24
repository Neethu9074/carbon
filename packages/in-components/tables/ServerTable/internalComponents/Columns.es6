import React from 'react';

import { Tr, Th, SortableTh } from 'in-components/tables/sharedComponents';

export default function Columns({ setOrder, orderBy, orderDirection, columnDefinitions }) {
  return (
    <Tr size="compact">
      {columnDefinitions.map(columnDefinition => {
        const label = columnDefinition.label || columnDefinition.id;
        if (columnDefinition.sortable === false) {
          return <Th key={columnDefinition.id}>{label}</Th>;
        }

        const isSortedByThisColumn = orderBy === columnDefinition.id;
        return (
          <SortableTh
            key={columnDefinition.id}
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
