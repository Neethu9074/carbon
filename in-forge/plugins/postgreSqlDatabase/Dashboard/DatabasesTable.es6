import React from 'react';

import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import {emptyList} from 'in-services/fixedImmutables';
import {Row, Col} from 'in-components/Grid';
import {
  percentageZeroDecimalPlaces,
  zeroDecimalPlaces
} from 'in-services/formatters/number';

const hitRateFormatter = d => d < 0 ? 'No activity' : percentageZeroDecimalPlaces(d);
const queriesFormatter = d => d < 0 ? 'No activity' : zeroDecimalPlaces(d);

export default function DatabasesTable({snapshot, timeframe}) {
  const heapSpaces = snapshot.getIn(['data', 'dbs'], emptyList).sort();

  if (heapSpaces.size === 0) {
    return null;
  }

  return (
    <DashboardSection title='Databases'>
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
        <Col cols={6}>
          <ChartWithLegend snapshot={context.snapshot}
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

          <ChartWithLegend snapshot={context.snapshot}
                           timeframe={context.timeframe}
                           height={150}
                           margins={{
                              left: 80
                           }}
                           y1={{
                             min: 0,
                             formatter: queriesFormatter,
                             metrics: [
                               'databases.' + db + '.queries_active',
                               'databases.' + db + '.queries_waiting'
                             ],
                             labels: [
                               'Queries active',
                               'Queries waiting'
                             ],
                             type: 'line'
                           }}/>
        </Col>
        <Col cols={6}>
          <ChartWithLegend snapshot={context.snapshot}
                           timeframe={context.timeframe}
                           height={150}
                           margins={{
                              left: 80
                           }}
                           y1={{
                             min: 0,
                             formatter: queriesFormatter,
                             metrics: [
                               'databases.' + db + '.queries_select',
                               'databases.' + db + '.queries_update',
                               'databases.' + db + '.queries_insert',
                               'databases.' + db + '.queries_delete'
                             ],
                             labels: [
                               'SELECT Queries',
                               'UPDATE Queries',
                               'INSERT Queries',
                               'DELETE Queries'
                             ],
                             type: 'line'
                           }}/>

          <ChartWithLegend snapshot={context.snapshot}
                           timeframe={context.timeframe}
                           height={150}
                           margins={{
                              left: 80
                           }}
                           y1={{
                             min: 0,
                             formatter: queriesFormatter,
                             metrics: [
                               'databases.' + db + '.xact_commit'
                             ],
                             labels: [
                               'Committed transactions'
                             ],
                             type: 'line'
                           }}/>
        </Col>
      </Row>
      <Row>
        <Col cols={6}>
          <ChartWithLegend snapshot={context.snapshot}
                          timeframe={context.timeframe}
                          height={150}
                          margins={{
                             left: 80
                          }}
                          y1={{
                            min: 0,
                            formatter: queriesFormatter,
                            metrics: [
                              'databases.' + db + '.xact_rollback'
                            ],
                            labels: [
                              'Rolled back transactions'
                            ],
                            type: 'line'
                          }}/>

          <ChartWithLegend snapshot={context.snapshot}
                          timeframe={context.timeframe}
                          height={150}
                          margins={{
                             left: 80
                          }}
                          y1={{
                            min: 0,
                            formatter: zeroDecimalPlaces,
                            metrics: [
                              'databases.' + db + '.conflicts'
                            ],
                            labels: [
                              'Standby Conflicts'
                            ],
                            type: 'line'
                          }}/>
        </Col>
        <Col cols={6}>
          <ChartWithLegend snapshot={context.snapshot}
                          timeframe={context.timeframe}
                          height={150}
                          margins={{
                            left: 80
                          }}
                          y1={{
                            min: 0,
                            max: 1,
                            metrics: [
                              'databases.' + db + '.blks_hit_rate'
                            ],
                            labels: [
                              'Cache Hit Ratio'
                            ],
                            type: 'line',
                            formatter: hitRateFormatter
                          }}/>

          <ChartWithLegend snapshot={context.snapshot}
                          timeframe={context.timeframe}
                          height={150}
                          margins={{
                             left: 80
                          }}
                          y1={{
                            min: 0,
                            formatter: queriesFormatter,
                            metrics: [
                              'databases.' + db + '.idx_tup_read',
                              'databases.' + db + '.idx_tup_fetch'
                            ],
                            labels: [
                              'Tuple read',
                              'Tuple fetch'
                            ],
                            type: 'line'
                          }}/>
        </Col>
      </Row>
    </div>
  );
}
