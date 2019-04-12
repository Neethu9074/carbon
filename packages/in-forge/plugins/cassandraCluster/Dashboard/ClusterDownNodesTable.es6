import React from 'react';

import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'HostId',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  }
];

export default function ClusterDownNodesTable({ snapshot }) {
  const unreachable = (snapshot.getIn(['data', 'unreachableNodes']) || emptyList).toArray();
  const rows = unreachable.map(id => {
    return {
      key: id
    };
  });

  return <Table withoutPadding cardTitle={`Unreachable Nodes (${rows.length})`} cols={cols} rows={rows} />;
}
