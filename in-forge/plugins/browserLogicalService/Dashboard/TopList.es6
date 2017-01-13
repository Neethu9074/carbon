import React from 'react';

import LinkToTraces from 'in-forge/plugins/browserLogicalService/Dashboard/LinkToTraces';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import {zeroDecimalPlaces} from 'in-services/formatters/number';
import ExpandableTable from 'in-components/ExpandableTable';


export default function TopList({title, items, nameColumnLabel, valueColumnLabel, buildQuery}) {
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


  function createRow(item) {
    const name = item.get('name');
    return ([
      <td>
        <LinkToTraces query={buildQuery(name)}>
          {name}
        </LinkToTraces>
      </td>,
      <td>{zeroDecimalPlaces(item.get('value'))}</td>,
    ]);
  }

}


function getKey(item) {
  return item.get('name');
}
