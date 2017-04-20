import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ExpandableTable from 'in-components/ExpandableTable';
import { formatDateTime } from 'in-services/formatters/date';
import { emptyList } from 'in-services/fixedImmutables';

export default function Table({ snapshot, timeframe }) {
  const apps = snapshot.getIn(['data', 'apps'], emptyList);

  if (apps.size === 0) {
    return null;
  }

  return (
    <DashboardSection title="Most Recent Apps">
      <ExpandableTable
        data={apps}
        getKey={getKey}
        createHeader={createHeader}
        createRow={createRow}
        context={{
          snapshot,
          timeframe
        }}
        createDetails={createDetails}
      />
    </DashboardSection>
  );
}

function getKey(app) {
  return app.get('id');
}

function createHeader() {
  return (
    <thead>
      <tr>
        <th>Application Id</th>
        <th>Name</th>
        <th>State</th>
        <th>Final Status</th>
        <th>User</th>
        <th>Type</th>
        <th>Start Time</th>
        <th>Finish Time</th>
      </tr>
    </thead>
  );
}

function createRow(app) {
  return [
    <td>{app.get('id')}</td>,
    <td>{app.get('name')}</td>,
    <td>{app.get('state')}</td>,
    <td>{app.get('finalStatus')}</td>,
    <td>{app.get('user')}</td>,
    <td>{app.get('type')}</td>,
    <td>{formatDateTime(app.get('startTime'))}</td>,
    <td>{formatDateTime(app.get('finishTime'))}</td>
  ];
}

function createDetails() {
  return null;
}
