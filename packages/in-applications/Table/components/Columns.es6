import React from 'react';

import SvgIcon from 'in-components/SvgIcon';

import locals from './Columns.mless';

export default function Columns({ setOrder, orderBy, orderDirection, columnDefinitions }) {
  const keys = Object.keys(columnDefinitions);
  return (
    <tr className={locals.columns}>
      {keys.map(id => (
        <th key={id} onClick={() => setOrder(id, getOrderDirection(orderBy === id, orderDirection))}>
          <div className={locals.column}>
            {id}
            {orderBy === id ? (
              <SvgIcon
                className={locals.icon}
                type={orderDirection === 'ASC' ? 'triangle_up' : 'triangle_down'}
                height={6}
                color="#16363E"
              />
            ) : (
              <SvgIcon className={locals.icon} type="triangle_up" height={6} color="#ccc" />
            )}
          </div>
        </th>
      ))}
    </tr>
  );
}

function getOrderDirection(isAlreadyOrderedBy, currentOrderDirection) {
  if (!isAlreadyOrderedBy) {
    return 'ASC';
  }
  return currentOrderDirection === 'ASC' ? 'DESC' : 'ASC';
}
