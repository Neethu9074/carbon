import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import {emptyList} from 'in-services/fixedImmutables';
import TwoColumnRow from 'in-sdk/components/dashboard/TwoColumnRow';
import Mtd from 'in-components/Mtd';

import {
  zeroDecimalPlaces,
  msZeroDecimalPlaces
} from 'in-services/formatters/number';

const queriesFormatter = d => d < 0 ? 'No activity' : zeroDecimalPlaces(d);

export default function DatabasesTable({snapshot, timeframe}) {
  const databases = snapshot.getIn(['data', 'dbs'], emptyList).toArray().sort();

  if (databases.size === 0) {
    return null;
  }

  return (
    <DashboardSection title='Schemas'>
      <ExpandableTable data={databases}
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

function getKey(db) {
  return db;
}

function createHeader() {
  return (
    <thead>
      <tr>
        <th>Schema</th>
        <th>Queries</th>
        <th>Avg. Query Latency</th>
      </tr>
    </thead>
  );
}

function createRow(db, index, context) {
  return ([
    <td>{db}</td>,
    <Mtd metric={'databases.' + db + '.queries'}
         snapshot={context.snapshot} />,
    <Mtd metric={'databases.' + db + '.avg_query_latency'}
         snapshot={context.snapshot} />
  ]);
}

function createDetails(db, i, context) {
  return (
    <div>
      <ChartWithLegend snapshotId={context.snapshot.get('id')}
                       timeframe={context.timeframe}
                       margins={{
                         left: 80
                       }}
                       y1={{
                         min: 0,
                         metrics: [
                           'databases.' + db + '.avg_query_latency'
                         ],
                         labels: [
                           'avg. Query Latency'
                         ],
                         type: 'line',
                         formatter: msZeroDecimalPlaces
                     }} />
      <TwoColumnRow>
        <ChartWithLegend snapshotId={context.snapshot.get('id')}
                         timeframe={context.timeframe}
                         margins={{
                          left: 80
                         }}
                         y1={{
                           min: 0,
                           formatter: queriesFormatter,
                           metrics: [
                             'databases.' + db + '.queries'
                           ],
                           labels: [
                             'Queries'
                           ],
                           type: 'line'
                         }} />
        <ChartWithLegend snapshotId={context.snapshot.get('id')}
                         timeframe={context.timeframe}
                         margins={{
                            left: 80
                         }}
                         y1={{
                           min: 0,
                           formatter: queriesFormatter,
                           metrics: [
                             'databases.' + db + '.select_count',
                             'databases.' + db + '.insert_count',
                             'databases.' + db + '.update_count',
                             'databases.' + db + '.delete_count',
                             'databases.' + db + '.other_count'
                           ],
                           labels: [
                             'SELECTS',
                             'INSERTS',
                             'UPDATES',
                             'DELETES',
                             'OTHER'
                           ],
                           type: 'stackedArea'
                         }} />
      </TwoColumnRow>
    </div>
  );
}
