import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import Mtd from 'in-components/Mtd';
import {zeroDecimalPlaces} from 'in-services/formatters/number';
import {emptyList} from 'in-services/fixedImmutables';


export default function Table({snapshot, timeframe}) {
  const datasourceNames = snapshot.getIn(['data', 'datasourceNames'], emptyList).sort();
  if (datasourceNames.size === 0) {
    return null;
  }

  return (
    <DashboardSection title='Database Connection Pools'>
      <ExpandableTable data={datasourceNames}
                       getKey={getKey}
                       createHeader={createHeader}
                       createRow={createRow}
                       context={{
                         snapshot,
                         timeframe
                       }}
                       createDetails={createDetails} />
    </DashboardSection>
  );
}

function getKey(datasourceName) {
  return datasourceName;
}

function createHeader() {
  return (
    <thead>
      <tr>
        <th>Name</th>
        <th>Available Connections</th>
        <th>Connections in Pool</th>
        <th>Requests Waiting for Connection</th>
        <th>Connections Created</th>
      </tr>
    </thead>
  );
}

function createRow(datasourceName, i, context) {
  return ([
    <td>{datasourceName}</td>,
    <Mtd metric={'datasources.' + datasourceName + '.availableConnections'}
         formatter={zeroDecimalPlaces}
         snapshot={context.snapshot} />,
    <Mtd metric={'datasources.' + datasourceName + '.connectionsInPool'}
         formatter={zeroDecimalPlaces}
         snapshot={context.snapshot} />,
    <Mtd metric={'datasources.' + datasourceName + '.requestsWaitingForConnection'}
         formatter={zeroDecimalPlaces}
         snapshot={context.snapshot} />,
    <Mtd metric={'datasources.' + datasourceName + '.connectionsCreated'}
         formatter={zeroDecimalPlaces}
         snapshot={context.snapshot} />
  ]);
}

function createDetails(datasourceName, i, context) {
  return (
    <div>
      <ChartWithLegend snapshotId={context.snapshot.get('id')}
                       timeframe={context.timeframe}
                       margins={{
                         left: 80
                       }}
                       y1={{
                         formatter: zeroDecimalPlaces,
                         metrics: [
                           'datasources.' + datasourceName + '.availableConnections',
                           'datasources.' + datasourceName + '.connectionsInPool',
                           'datasources.' + datasourceName + '.requestsWaitingForConnection',
                           'datasources.' + datasourceName + '.connectionsCreated'
                         ],
                         labels: [
                           'Available Connections',
                           'Connections in Pool',
                           'Requests Waiting for Connection',
                           'Connections Created'
                         ],
                         type: 'line'
                       }} />
    </div>
  );
}
