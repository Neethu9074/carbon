import React from 'react';

import {zeroDecimalPlaces, msZeroDecimalPlaces} from 'in-services/formatters/number';
import {emptyList} from 'in-services/fixedImmutables';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import Mtd from 'in-components/Mtd';


export default function ConnectionPoolsTable({snapshot, timeframe}) {
  const connectionPoolNames = snapshot.getIn(['data', 'connectionPoolNames'], emptyList).sort();
  if (connectionPoolNames.size === 0) {
    return null;
  }

  return (
    <DashboardSection title='Database Connection Pools'>
      <ExpandableTable data={connectionPoolNames}
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

function getKey(connectionPoolName) {
  return connectionPoolName;
}

function createHeader() {
  return (
    <thead>
      <tr>
        <th>Name</th>
        <th>ManagedConnection Objects in Use</th>
        <th>Free Connections in Pool</th>
        <th>Connection Objects in Use</th>
        <th>Average Waiting Time for Connection</th>
        <th>Connections Created</th>
      </tr>
    </thead>
  );
}

function createRow(connectionPoolName, i, context) {
  return ([
    <td>{connectionPoolName}</td>,
    <Mtd metric={'connectionPools.' + connectionPoolName + '.managedConnectionCount'}
         formatter={zeroDecimalPlaces}
         snapshot={context.snapshot} />,
    <Mtd metric={'connectionPools.' + connectionPoolName + '.freeConnectionCount'}
         formatter={zeroDecimalPlaces}
         snapshot={context.snapshot} />,
    <Mtd metric={'connectionPools.' + connectionPoolName + '.connectionHandleCount'}
         formatter={zeroDecimalPlaces}
         snapshot={context.snapshot} />,
    <Mtd metric={'connectionPools.' + connectionPoolName + '.waitTime'}
         formatter={msZeroDecimalPlaces}
         snapshot={context.snapshot} />,
    <Mtd metric={'connectionPools.' + connectionPoolName + '.connectionsCreated'}
         formatter={zeroDecimalPlaces}
         snapshot={context.snapshot} />
  ]);
}

function createDetails(connectionPoolName, i, context) {
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
                           'connectionPools.' + connectionPoolName + '.managedConnectionCount',
                           'connectionPools.' + connectionPoolName + '.freeConnectionCount',
                           'connectionPools.' + connectionPoolName + '.connectionHandleCount',
                           'connectionPools.' + connectionPoolName + '.connectionsCreated'
                         ],
                         labels: [
                           'ManagedConnection Objects in Use',
                           'Free Connections in Pool',
                           'Connection Objects in Use',
                           'Connections Created'
                         ],
                         type: 'line'
                       }} />
      <ChartWithLegend snapshotId={context.snapshot.get('id')}
                       timeframe={context.timeframe}
                       margins={{
                         left: 80,
                         right: 40
                       }}
                       y1={{
                         formatter: msZeroDecimalPlaces,
                         metrics: [
                           'connectionPools.' + connectionPoolName + '.waitTime'
                         ],
                         labels: [
                           'Average Waiting Time for Connection'
                         ],
                         type: 'line'
                       }} />
    </div>
  );
}
