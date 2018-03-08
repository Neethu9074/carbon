import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Columns.mless';

export default function Columns({ setOrder, orderBy, orderDirection, columnDefinitions }) {
  return (
    <tr className={locals.columns}>
      {columnDefinitions.map(columnDefinition => {
        const isSortableColumn = columnDefinition.sortable !== false;
        const isSortedByThisColumn = orderBy === columnDefinition.id;
        return (
          <th key={columnDefinition.id} className={locals.columnWrapper}>
            <a
              href=""
              className={evaluateClassNames({
                [locals.column]: true,
                [locals.sortableColumn]: isSortableColumn
              })}
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();

                if (!isSortableColumn) {
                  return;
                }
                setOrder(
                  columnDefinition.id,
                  getOrderDirection(isSortedByThisColumn, orderDirection, columnDefinition.defaultOrderDirection)
                );
              }}
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
            </a>
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
