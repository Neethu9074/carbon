import React from 'react';

import { number } from 'in-services/formatters/number';
import { emptyMap } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Type',
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
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.server.getIn(['address', 'port']);
      },
      getContent: number.compact
    }
  }
];

export default function HttpServersTable({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'http'], emptyMap)
    .map((server, name) => {
      return {
        key: name,
        name,
        server,
        snapshotId,
        timeConfig
      };
    })
    .valueSeq()
    .toArray();

  if (rows.length === 0) {
    return null;
  }

  return <Table withoutPadding cardTitle={`HTTP Servers (${rows.length})`} cols={cols} rows={rows} />;
}
