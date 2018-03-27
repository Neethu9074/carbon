import React from 'react';

import { Th } from 'in-components/tables/sharedComponents/Table';
import SvgIcon from 'in-components/SvgIcon';

import locals from './SortableTh.mless';

export default function SortableTh({ isSortedByThisColumn, sortDirection, onClick, children }) {
  return (
    <Th>
      <a href="" className={locals.column} onClick={onClick}>
        {children}
        {isSortedByThisColumn ? (
          <SvgIcon
            className={locals.icon}
            type={sortDirection === 'ASC' ? 'triangle_up' : 'triangle_down'}
            height={6}
            color="#16363E"
          />
        ) : (
          <SvgIcon className={locals.icon} type="triangle_up" height={6} color="#ccc" />
        )}
      </a>
    </Th>
  );
}
