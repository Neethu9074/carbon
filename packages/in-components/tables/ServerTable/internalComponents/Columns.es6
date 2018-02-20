import React from 'react';

import SvgIcon from 'in-components/SvgIcon';

import locals from './Columns.mless';

export default function Columns({ setOrder, orderBy, orderDirection, columnDefinitions }) {
  return (
    <tr className={locals.columns}>
      {columnDefinitions.map(columnDefinition => {
        const isSortableColumn = columnDefinition.sortable !== false;
        const isSortedByThisColumn = orderBy === columnDefinition.id;
        return (
          <th
            key={columnDefinition.id}
            onClick={() => setOrder(columnDefinition.id, getOrderDirection(isSortedByThisColumn, orderDirection))}
            className={locals.column}
          >
            {columnDefinition.label || columnDefinition.id}
            {isSortableColumn &&
              (isSortedByThisColumn ? (
                <SvgIcon
                  className={locals.icon}
                  type={orderDirection === 'ASC' ? 'triangle_up' : 'triangle_down'}
                  height={6}
                  color="#16363E"
                />
              ) : (
                <SvgIcon className={locals.icon} type="triangle_up" height={6} color="#ccc" />
              ))}
          </th>
        );
      })}
    </tr>
  );
}

function getOrderDirection(isAlreadyOrderedBy, currentOrderDirection) {
  if (!isAlreadyOrderedBy) {
    return 'ASC';
  }
  return currentOrderDirection === 'ASC' ? 'DESC' : 'ASC';
}
