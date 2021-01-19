/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { SortableTh } from 'in-components/tables/sharedComponents';

export default function SortableColumn(props) {
  const { orderBy, orderDirection, defaultDirection, technicalName, label, onChangeOrder } = props;

  return (
    <SortableTh
      {...props}
      sortDirection={orderDirection}
      isSortedByThisColumn={orderBy === technicalName}
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
