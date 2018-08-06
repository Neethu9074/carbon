import React from 'react';

import { SortableTh } from 'in-components/tables/sharedComponents';

export default function SortableCallColumn({
  orderBy,
  orderDirection,
  defaultDirection,
  technicalName,
  label,
  onChangeOrder,
  noWrap
}) {
  return (
    <SortableTh
      isSortedByThisColumn={orderBy === technicalName}
      sortDirection={orderDirection}
      noWrap={noWrap}
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        if (orderBy === technicalName) {
          onChangeOrder({
            orderBy: technicalName,
            orderDirection: orderDirection === 'ASC' ? 'DESC' : 'ASC'
          });
        } else {
          onChangeOrder({
            orderBy: technicalName,
            orderDirection: defaultDirection
          });
        }
      }}
    >
      {label}
    </SortableTh>
  );
}
