import React from 'react';

import { emptyList } from 'in-services/fixedImmutables';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Schema',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  }
];

export default function DatabasesTable({ snapshot }) {
  const rows = snapshot.getIn(['data', 'databases'], emptyList).toArray().map(name => {
    return {
      key: name
    };
  });

  if (rows.length === 0) {
    return null;
  }

  return (
    <DashboardSection title={`Databases (${rows.length})`}>
      <Table cols={cols} rows={rows} />
    </DashboardSection>
  );
}
