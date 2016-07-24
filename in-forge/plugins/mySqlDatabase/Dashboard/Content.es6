import irpt from 'react-immutable-proptypes';
import React from 'react';

import DatabasesTable from 'in-forge/plugins/mySqlDatabase/Dashboard/DatabasesTable';
import {msZeroDecimalPlaces} from 'in-services/formatters/number';
import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import {emptyList} from 'in-services/fixedImmutables';
import {timeframeShape} from 'in-stores/timeline';


const verPatt = /([5-9]+\.[6-9]+\.([0-9]+)).*/;


const msFormatter = d => d < 0 ? 'No activity' : msZeroDecimalPlaces(d);

function perfDataAvailable(version) {
  return verPatt.test(version) && parseInt(verPatt.exec(version)[2], 10) > 9;
}

export default function MySqlDashboard({snapshot, timeframe}) {
  const data = snapshot.get('data');
  const snapshotId = snapshot.get('id');
  const version = data.get('variables.VERSION');
  const dbs = data.get('dbs', emptyList).toArray();
  const waitNames = data.get('wait_event_names', emptyList).toArray().sort();

  return (
    <div>
      <DashboardSection title='Queries'>
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
                         margins={{
                           left: 80,
                           right: 60
                         }}
                         y1={{
                           min: 0,
                           metrics: [
                             'status.QUERIES'
                           ],
                           labels: [
                             'Queries'
                           ],
                           type: 'line'
                         }}
                         y2={{
                           min: 0,
                           metrics: [
                             'status.COM_SELECT',
                             'status.COM_UPDATE',
                             'status.COM_INSERT',
                             'status.COM_DELETE',
                             'status.COM_OTHER'
                           ],
                           labels: [
                             'SELECTS',
                             'UPDATES',
                             'INSERTS',
                             'DELETES',
                             'OTHER'
                           ],
                           type: 'line'
                         }}/>
          <ChartWithLegend snapshotId={snapshotId}
                           timeframe={timeframe}
                           margins={{
                             left: 80
                           }}
                           y1={{
                             min: 0,
                             metrics: [
                               'status.SLOW_QUERIES',
                               'status.COM_SHOW_ERRORS'
                             ],
                             labels: [
                               'Slow Queries',
                               'Errors'
                             ],
                             type: 'line'
                         }}/>
      </DashboardSection>
      {perfDataAvailable(version) ?
        <DashboardSection title='Latency'>
          <ChartWithLegend snapshotId={snapshotId}
                           timeframe={timeframe}
                           margins={{
                             left: 80
                           }}
                           y1={{
                             min: 0,
                             metrics: [
                               'status.DB_QUERY_LATENCY'
                             ],
                             labels: [
                               'avg. Query Latency'
                             ],
                             type: 'line',
                             formatter: msZeroDecimalPlaces
                         }}/>
        </DashboardSection>
      : null }
      <DashboardSection title='Clients'>
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
                         margins={{
                           left: 80
                         }}
                         y1={{
                           min: 0,
                           metrics: [
                             'status.CONNECTIONS',
                             'status.MAX_USED_CONNECTIONS',
                             'status.ABORTED_CONNECTS'
                           ],
                           labels: [
                             'Connections',
                             'Max used connections',
                             'Aborted connects'
                           ],
                           type: 'line'
                       }}/>
      </DashboardSection>
      {perfDataAvailable(version) && waitNames && waitNames.length > 0 ?
        <DashboardSection title='Wait Events'>
          <ChartWithLegend snapshotId={snapshotId}
                           timeframe={timeframe}
                           margins={{
                             left: 80
                           }}
                           y1={{
                             min: 0,
                             metrics: waitNames.map(name => 'wait.' + name),
                             labels: waitNames,
                             type: 'line',
                             formatter: msFormatter
                         }}/>
        </DashboardSection>
      : null }
      <DashboardSection title='Key Access'>
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
                         margins={{
                           left: 80,
                           right: 60
                         }}
                         y1={{
                           min: 0,
                           metrics: [
                             'status.KEY_READ_REQUESTS',
                             'status.KEY_WRITE_REQUESTS'
                           ],
                           labels: [
                             'Read Requests',
                             'Write Requests'
                           ],
                           type: 'line'
                         }}
                         y2={{
                           min: 0,
                           metrics: [
                             'status.KEY_READS',
                             'status.KEY_WRITES'
                           ],
                           labels: [
                             'Reads',
                             'Writes'
                           ],
                           type: 'line'
                         }}
                         />
      </DashboardSection>

      {perfDataAvailable(version) && dbs && dbs.length > 0 ?
        <DatabasesTable snapshot={snapshot}
                        timeframe={timeframe} />
      : null}
    </div>
  );
}

MySqlDashboard.propTypes = {
  snapshot: irpt.map.isRequired,
  timeframe: timeframeShape
};
