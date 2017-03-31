import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ExpandableTable from 'in-components/ExpandableTable';
import { emptyList } from 'in-services/fixedImmutables';

export default function ApplicationPoolsTable({ snapshot }) {
  const allPools = snapshot.getIn(['data', 'allpools'], emptyList).toArray();

  if (allPools.length === 0) {
    return null;
  }

  return (
    <DashboardSection title="Application Pools">
      <ExpandableTable
        data={allPools}
        getKey={getKey}
        createHeader={createHeader}
        createRow={createRow}
        context={{
          snapshot
        }}
      />
    </DashboardSection>
  );
}

function getKey(pool) {
  return pool;
}

function createHeader() {
  return (
    <thead>
      <tr>
        <th>Name</th>
        <th>ASP.NET Version</th>
      </tr>
    </thead>
  );
}

function createRow(pool, i, { snapshot }) {
  return [<td>{pool}</td>, <td>{snapshot.getIn(['data', 'iis.apppools', pool, 'runtimeversion'])}</td>];
}
