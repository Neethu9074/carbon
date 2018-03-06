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
            onClick={() =>
              setOrder(
                columnDefinition.id,
                getOrderDirection(isSortedByThisColumn, orderDirection, columnDefinition.defaultOrderDirection)
              )
            }
          >
            <div className={locals.column}>
              {columnDefinition.label || columnDefinition.id}
              {isSortableColumn && (
                <div className={locals.sortIcons}>
                  <SvgIcon
                    className={locals.icon}
                    type="triangle_up"
                    height={5}
                    color={isSortedByThisColumn && orderDirection === 'ASC' ? '#16363E' : '#ccc'}
                  />
                  <SvgIcon
                    className={locals.icon}
                    type="triangle_down"
                    height={5}
                    color={isSortedByThisColumn && orderDirection === 'DESC' ? '#16363E' : '#ccc'}
                  />
                </div>
              )}
            </div>
          </th>
        );
      })}
    </tr>
  );
}

function getOrderDirection(isAlreadyOrderedBy, currentOrderDirection, defaultOrderDirection = 'ASC') {
  if (!isAlreadyOrderedBy) {
    return defaultOrderDirection;
  }
  return currentOrderDirection === 'ASC' ? 'DESC' : 'ASC';
}
