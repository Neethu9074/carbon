import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import {zeroDecimalPlaces} from 'in-services/formatters/number';
import ExpandableTable from 'in-components/ExpandableTable';


export default function TopList({title, items, nameColumnLabel, valueColumnLabel}) {
  if (!items || items.size === 0) {
    return null;
  }

  return (
    <DashboardSection title={title}>
      <ExpandableTable data={items}
                       getKey={getKey}
                       createHeader={createHeader}
                       createRow={createRow} />
    </DashboardSection>
  );


  function createHeader() {
    return (
      <thead>
        <tr>
          <th>{nameColumnLabel}</th>
          <th>{valueColumnLabel}</th>
        </tr>
      </thead>
    );
  }
}


function getKey(item) {
  return item.get('name');
}


function createRow(item) {
  return ([
    <td>{item.get('name')}</td>,
    <td>{zeroDecimalPlaces(item.get('value'))}</td>,
  ]);
}
