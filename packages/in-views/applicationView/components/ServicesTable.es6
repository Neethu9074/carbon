import { fromJS } from 'immutable';
import React from 'react';

import SearchableTable from 'in-components/SearchableTable';
import { always } from 'in-services/fixedStreams';
import connectTo from 'in-hoc/connectTo';

const cols = [
  {
    title: 'Name',
    type: 'string',
    width: 100,
    typeArgs: {
      getValue(row) {
        return row.label;
      }
    }
  }
];

export default connectTo(
  {
    services: always(
      fromJS([
        {
          id: '1',
          label: 'Services 1'
        },
        {
          id: '2',
          label: 'Services 2'
        }
      ])
    )
  },
  function ServicesTable({ services }) {
    const rows = services.toArray().map(application => ({
      key: application.get('id'),
      label: application.get('label')
    }));

    return <SearchableTable maxItemsPerPage={16} cols={cols} rows={rows} initialSortColumn={0} />;
  }
);
