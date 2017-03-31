import React from 'react';

import { emptyList } from 'in-services/fixedImmutables';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ExpandableTable from 'in-components/ExpandableTable';

export default function DatabasesTable({ snapshot, timeframe }) {
  const allDatabases = snapshot.getIn(['data', 'databases'], emptyList);

  if (allDatabases.size === 0) {
    return null;
  }

  return (
    <DashboardSection title="Databases">
      <ExpandableTable
        data={allDatabases}
        getKey={getKey}
        createHeader={createHeader}
        createRow={createRow}
        context={{
          snapshot,
          timeframe
        }}
      />
    </DashboardSection>
  );
}

function getKey(name) {
  return name;
}

function createHeader() {
  return (
    <thead>
      <tr>
        <th>Name</th>
      </tr>
    </thead>
  );
}

function createRow(name) {
  return [<td>{name}</td>];
}
