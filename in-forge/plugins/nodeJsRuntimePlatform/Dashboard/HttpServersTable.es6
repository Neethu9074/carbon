import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ExpandableTable from 'in-components/ExpandableTable';
import { emptyMap } from 'in-services/fixedImmutables';

export default function HttpServersTable({ snapshot, timeframe }) {
  const servers = snapshot.getIn(['data', 'http'], emptyMap);

  if (servers.size === 0) {
    return null;
  }

  return (
    <DashboardSection title="HTTP Servers">
      <ExpandableTable
        data={servers}
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

function getKey(server, key) {
  return key;
}

function createHeader() {
  return (
    <thead>
      <tr>
        <th>Type</th>
        <th>Bind Address</th>
        <th>Port</th>
      </tr>
    </thead>
  );
}

function createRow(server) {
  return [
    <td>{server.get('type')}</td>,
    <td>{server.getIn(['address', 'address'])}</td>,
    <td>{server.getIn(['address', 'port'])}</td>
  ];
}
