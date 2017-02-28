import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import {emptyList} from 'in-services/fixedImmutables';
import {
  withSiPrefixThreeDecimalPlaces
} from 'in-services/formatters/number';
import Mtd from 'in-components/Mtd';


export default function CountersTable({snapshot, timeframe}) {
  const counters = snapshot.getIn(['data', 'metrics.counters'], emptyList);

  if (counters.size === 0) {
    return null;
  }

  return (
    <DashboardSection title='Counters'>
      <ExpandableTable data={counters}
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


function getKey(gauge) {
  return gauge;
}


function createHeader() {
  return (
    <thead>
      <tr>
        <th>Name</th>
        <th>Value</th>
      </tr>
    </thead>
  );
}


function createRow(counter, index, context) {
  return ([
    <td>{counter}</td>,
    <Mtd metric={'metrics.counters.' + counter}
         snapshot={context.snapshot}
         formatter={withSiPrefixThreeDecimalPlaces} />
  ]);
}


function createDetails(counter, index, context) {
  return (
    <ChartWithLegend snapshotId={context.snapshot.get('id')}
                     timeframe={context.timeframe}
                     margins={{
                       left: 90
                     }}
                     y1={{
                       formatter: withSiPrefixThreeDecimalPlaces,
                       metrics: ['metrics.counters.' + counter],
                       labels: [counter],
                       type: 'line'
                     }} />
  );
}
