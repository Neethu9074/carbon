import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { emptyMap } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Heap Space',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.server.get('type');
      }
    }
  },
  {
    title: 'Bind Address',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.server.getIn(['address', 'address']);
      }
    }
  },
  {
    title: 'Port',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.server.getIn(['address', 'port']);
      }
    }
  }
];

export default function HttpServersTable({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'http'], emptyMap)
    .map((server, name) => {
      return {
        key: name,
        name,
        server,
        snapshotId,
        timeframe
      };
    })
    .valueSeq()
    .toArray();

  if (rows.length === 0) {
    return null;
  }

  return (
    <DashboardSection title={`HTTP Servers (${rows.length})`}>
      <Table cols={cols} rows={rows} />
    </DashboardSection>
  );
}
