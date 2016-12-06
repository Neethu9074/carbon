import React from 'react';

import {activityZeroDecimalPlaces, hitRateZeroDecimalPlaces, zeroDecimalPlaces} from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import DashboardNotification from 'in-components/DashboardNotification';
import TwoColumnRow from 'in-sdk/components/dashboard/TwoColumnRow';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import {emptyList} from 'in-services/fixedImmutables';
import Mtd from 'in-components/Mtd';


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
        <th>Queries</th>
        <th>Queries active</th>
        <th>Queries waiting</th>
        <th>Committed transactions</th>
        <th>Rolled back transactions</th>
        <th>Cache Hit Ratio</th>
        <th>Standby Conflicts</th>
        <th>Tuple read</th>
        <th>Tuple fetch</th>
      </tr>
    </thead>
  );
}

function createRow(db, i, context) {
  return ([
    <td>{db}</td>,
    <Mtd metric={'databases.' + db + '.queries'}
         snapshot={context.snapshot}
         formatter={activityZeroDecimalPlaces} />,
    <Mtd metric={'databases.' + db + '.queries_active'}
        snapshot={context.snapshot}
        formatter={activityZeroDecimalPlaces} />,
    <Mtd metric={'databases.' + db + '.queries_waiting'}
        snapshot={context.snapshot}
        formatter={activityZeroDecimalPlaces} />,
    <Mtd metric={'databases.' + db + '.xact_commit'}
        snapshot={context.snapshot}
        formatter={activityZeroDecimalPlaces} />,
    <Mtd metric={'databases.' + db + '.xact_rollback'}
        snapshot={context.snapshot}
        formatter={activityZeroDecimalPlaces} />,
    <Mtd metric={'databases.' + db + '.blks_hit_rate'}
        snapshot={context.snapshot}
        formatter={hitRateZeroDecimalPlaces} />,
    <Mtd metric={'databases.' + db + '.conflicts'}
        snapshot={context.snapshot}
        formatter={zeroDecimalPlaces} />,
    <Mtd metric={'databases.' + db + '.idx_tup_read'}
        snapshot={context.snapshot}
        formatter={zeroDecimalPlaces} />,
    <Mtd metric={'databases.' + db + '.idx_tup_fetch'}
        snapshot={context.snapshot}
        formatter={zeroDecimalPlaces} />
  ]);
}

function displayQueries(snapshot, timeframe, db) {
  const snapshotId = snapshot.get('id');
  const sensorConnectionStatus =
    snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');
  const statErr =
    'ERROR: pg_stat_statements must be loaded via shared_preload_libraries';
  if (sensorConnectionStatus === statErr) {
    return (
      <DashboardNotification type='info'>
        To display detail query count, <strong>pg_stat_statements</strong>
        &nbsp;extension must be loaded via&nbsp;
        <a target='_blank' rel='noopener noreferrer'
        href='https://www.postgresql.org/docs/current/static/pgstatstatements.html'>
        shared_preload_libraries
        </a>&nbsp;in postgresql.conf
      </DashboardNotification>
    );
  }
  return (
    <ChartWithLegend snapshotId={snapshotId}
                     timeframe={timeframe}
                     margins={{
                        left: 80
                     }}
                     y1={{
                       min: 0,
                       formatter: activityZeroDecimalPlaces,
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
                     }} />
  );
}

function createDetails(db, i, context) {
  const snapshotId = context.snapshot.get('id');
  const timeframe = context.timeframe;

  return (
    <div>
      <ChartWithLegend snapshotId={snapshotId}
                       timeframe={timeframe}
                       margins={{
                        left: 80
                       }}
                       y1={{
                         min: 0,
                         formatter: activityZeroDecimalPlaces,
                         metrics: [
                           'databases.' + db + '.queries'
                         ],
                         labels: [
                           'Queries'
                         ],
                         type: 'line'
                       }} />
      {displayQueries(context.snapshot, timeframe, db)}

      <TwoColumnRow>
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
                         margins={{
                            left: 80
                         }}
                         y1={{
                           min: 0,
                           formatter: activityZeroDecimalPlaces,
                           metrics: [
                             'databases.' + db + '.queries_active',
                             'databases.' + db + '.queries_waiting'
                           ],
                           labels: [
                             'Queries active',
                             'Queries waiting'
                           ],
                           type: 'line'
                         }} />
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
                         margins={{
                            left: 80
                         }}
                         y1={{
                           min: 0,
                           formatter: activityZeroDecimalPlaces,
                           metrics: [
                             'databases.' + db + '.xact_commit'
                           ],
                           labels: [
                             'Committed transactions'
                           ],
                           type: 'line'
                         }} />
      </TwoColumnRow>
      <TwoColumnRow>
        <ChartWithLegend snapshotId={snapshotId}
                        timeframe={timeframe}
                        margins={{
                           left: 80
                        }}
                        y1={{
                          min: 0,
                          formatter: activityZeroDecimalPlaces,
                          metrics: [
                            'databases.' + db + '.xact_rollback'
                          ],
                          labels: [
                            'Rolled back transactions'
                          ],
                          type: 'line'
                        }} />
        <ChartWithLegend snapshotId={snapshotId}
                        timeframe={timeframe}
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
                          formatter: hitRateZeroDecimalPlaces
                        }} />
      </TwoColumnRow>
      <TwoColumnRow>
        <ChartWithLegend snapshotId={snapshotId}
                        timeframe={timeframe}
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
                        }} />


        <ChartWithLegend snapshotId={snapshotId}
                        timeframe={timeframe}
                        margins={{
                           left: 80
                        }}
                        y1={{
                          min: 0,
                          formatter: activityZeroDecimalPlaces,
                          metrics: [
                            'databases.' + db + '.idx_tup_read',
                            'databases.' + db + '.idx_tup_fetch'
                          ],
                          labels: [
                            'Tuple read',
                            'Tuple fetch'
                          ],
                          type: 'line'
                        }} />
      </TwoColumnRow>
    </div>
  );
}
