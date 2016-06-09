import React from 'react';

import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import {emptyList} from 'in-services/fixedImmutables';
import {Row, Col} from 'in-components/Grid';
import {
  zeroDecimalPlaces,
  msZeroDecimalPlaces
} from 'in-services/formatters/number';

const queriesFormatter = d => d < 0 ? 'No activity' : zeroDecimalPlaces(d);

export default function DatabasesTable({snapshot, timeframe}) {
  const databases = snapshot.getIn(['data', 'dbs'], emptyList).sort();

  if (databases.size === 0) {
    return null;
  }

  return (
    <DashboardSection title='Databases'>
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
        <th>Database</th>
      </tr>
    </thead>
  );
}


function createRow(db) {
  return ([
    <td>{db}</td>
  ]);
}


function createDetails(db, i, context) {
  return (
    <div>
      <Row>
        <Col cols={12}>
          <ChartWithLegend snapshotId={context.snapshot.get('id')}
                           timeframe={context.timeframe}
                           height={150}
                           margins={{
                             left: 80
                           }}
                           y1={{
                             min: 0,
                             metrics: [
                               'databases.' + db + '.avg_query_latency'
                             ],
                             labels: [
                               'Query Latency'
                             ],
                             type: 'line',
                             formatter: msZeroDecimalPlaces
                         }}/>
        </Col>
      </Row>
      <Row>
        <Col cols={6}>
          <ChartWithLegend snapshotId={context.snapshot.get('id')}
                           timeframe={context.timeframe}
                           height={150}
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
                           }}/>
        </Col>
        <Col cols={6}>
          <ChartWithLegend snapshotId={context.snapshot.get('id')}
                           timeframe={context.timeframe}
                           height={150}
                           margins={{
                              left: 80
                           }}
                           y1={{
                             min: 0,
                             formatter: queriesFormatter,
                             metrics: [
                               'databases.' + db + '.select_count',
                               'databases.' + db + '.insert_count',
                               'databases.' + db + '.delete_count',
                               'databases.' + db + '.update_count'
                             ],
                             labels: [
                               'SELECTS',
                               'UPDATES',
                               'INSERTS',
                               'DELETES'
                             ],
                             type: 'line'
                           }}/>

        </Col>
      </Row>
    </div>
  );
}
