import React from 'react';

import {emptyList} from 'in-services/fixedImmutables';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import {
  bytesTwoDecimalPlaces
} from 'in-services/formatters/number';
import Mtd from 'in-components/Mtd';


export default function KeyspacesTable({snapshot, timeframe}) {
  const keyspaces = snapshot.getIn(['data', 'keyspaces'], emptyList);

  if (keyspaces.size === 0) {
    return null;
  }

  return (
    <DashboardSection title='Keyspace Details'>
      <ExpandableTable data={keyspaces}
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


function getKey(keyspaceName) {
  return keyspaceName;
}


function createHeader() {
  return (
    <thead>
      <tr>
        <th>Keyspace</th>
        <th>Replication Factor</th>
        <th>Disk Size</th>
      </tr>
    </thead>
  );
}


function createRow(keyspaceName, i, context) {
  return ([
    <td>{keyspaceName}</td>,

    <td>{context.snapshot.getIn(['data', 'keyspacesInfo', keyspaceName, 'replicationFactor'])}</td>,

    <Mtd metric={'keyspace.' + keyspaceName + '.diskSize'}
         snapshot={context.snapshot}
         formatter={bytesTwoDecimalPlaces} />
  ]);
}


function createDetails(keyspaceName, i, context) {
  return (
    <ChartWithLegend snapshotId={context.snapshot.get('id')}
                     timeframe={context.timeframe}
                     margins={{
                       left: 80,
                       right: 80
                     }}

                     y1={{
                       metrics: [
                         'keyspace.' + keyspaceName + '.diskSize'
                       ],
                       labels: [
                         'Disk Size'
                       ],
                       formatter: bytesTwoDecimalPlaces,
                       tooltipFormatter: bytesTwoDecimalPlaces,
                       type: 'line'
                     }} />
  );
}
