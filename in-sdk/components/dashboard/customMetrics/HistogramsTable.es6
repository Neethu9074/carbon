import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import {emptyList} from 'in-services/fixedImmutables';
import {
  withSiPrefixThreeDecimalPlaces
} from 'in-services/formatters/number';
import Mtd from 'in-components/Mtd';


export default function MetersTable({snapshot, timeframe}) {
  const histograms = snapshot.getIn(['data', 'metrics.histograms'], emptyList);

  if (histograms.size === 0) {
    return null;
  }

  return (
    <DashboardSection title='Histograms'>
      <ExpandableTable data={histograms}
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


function getKey(histogram) {
  return histogram;
}


function createHeader() {
  return (
    <thead>
      <tr>
        <th>Name</th>
        <th>Mean</th>
      </tr>
    </thead>
  );
}


function createRow(histogram, index, context) {
  return ([
    <td>{histogram}</td>,
    <Mtd metric={'metrics.histograms.' + histogram + '.mean'}
         snapshot={context.snapshot}
         formatter={withSiPrefixThreeDecimalPlaces} />
  ]);
}


function createDetails(histogram, index, context) {
  return (
    <ChartWithLegend snapshotId={context.snapshot.get('id')}
                     timeframe={context.timeframe}
                     margins={{
                       left: 90
                     }}
                     y1={{
                         formatter: withSiPrefixThreeDecimalPlaces,
                         metrics: [
                           'metrics.histograms.' + histogram + '.mean',
                           'metrics.histograms.' + histogram + '.50th',
                           'metrics.histograms.' + histogram + '.99th',
                         ],
                         labels: ['mean', '50th', '99th'],
                         type: 'line'
                     }} />
  );
}
