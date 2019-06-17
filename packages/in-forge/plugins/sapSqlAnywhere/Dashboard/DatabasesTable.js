import React from 'react';

import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [];

export default function DatabasesTable({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'dbs'], emptyList)
    .toArray()
    .map(name => {
      return {
        key: name,
        snapshotId,
        timeConfig
      };
    });

  if (rows.length === 0) {
    return null;
  }

  return (
    <Table withoutPadding cardTitle={`Schemas (${rows.length})`} cols={cols} rows={rows} getRowDetails={getDetails} />
  );
}

function getDetails() {
  return <div />;
}
