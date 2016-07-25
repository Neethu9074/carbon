import React from 'react';

import {emptyList} from 'in-services/fixedImmutables';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import {
  bytesZeroDecimalPlaces,
  bytesTwoDecimalPlaces
} from 'in-services/formatters/number';
import Mtd from 'in-components/Mtd';


export default function HeapSpacesTable({snapshot, timeframe}) {
  const heapSpaces = snapshot.getIn(['data', 'heapSpaces'], emptyList);

  if (heapSpaces.size === 0) {
    return null;
  }

  return (
    <DashboardSection title='Heap Spaces'>
      <ExpandableTable data={heapSpaces}
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


function getKey(heapSpace) {
  return heapSpace;
}


function createHeader() {
  return (
    <thead>
      <tr>
        <th>Heap Space</th>
        <th>Available</th>
        <th>Current</th>
        <th>Used</th>
        <th>Physical</th>
      </tr>
    </thead>
  );
}


function createRow(heapSpace, i, context) {
  return ([
    <td>{heapSpace}</td>,
    <Mtd metric={'heapSpaces.' + heapSpace + '.available'}
         snapshot={context.snapshot}
         formatter={bytesTwoDecimalPlaces} />,
    <Mtd metric={'heapSpaces.' + heapSpace + '.current'}
         snapshot={context.snapshot}
         formatter={bytesTwoDecimalPlaces} />,
    <Mtd metric={'heapSpaces.' + heapSpace + '.used'}
         snapshot={context.snapshot}
         formatter={bytesTwoDecimalPlaces} />,
    <Mtd metric={'heapSpaces.' + heapSpace + '.physical'}
         snapshot={context.snapshot}
         formatter={bytesTwoDecimalPlaces} />
  ]);
}


function createDetails(name, i, context) {
  return (
    <ChartWithLegend snapshotId={context.snapshot.get('id')}
                     timeframe={context.timeframe}
                     margins={{
                       left: 90
                     }}

                     y1={{
                       min: 0,
                       formatter: bytesZeroDecimalPlaces,
                       tooltipFormatter: bytesTwoDecimalPlaces,
                       metrics: [
                         'heapSpaces.' + name + '.available',
                         'heapSpaces.' + name + '.current',
                         'heapSpaces.' + name + '.used',
                         'heapSpaces.' + name + '.physical'
                       ],
                       labels: [
                         'Available',
                         'Current',
                         'Used',
                         'Physical'
                       ],
                       type: 'line' }}/>
  );
}
