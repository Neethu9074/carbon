import irpt from 'react-immutable-proptypes';
import React from 'react';

import {bytesZeroDecimalPlaces, bytesTwoDecimalPlaces} from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import {timeframeShape} from 'in-stores/timeline';


export default function MongoDBDashboard({snapshot, timeframe}) {
  const dbs = snapshot.getIn(['data', 'databases']);
  const snapshotId = snapshot.get('id');

  return (
    <div>
      {dbs ?
      <DashboardSection title='Database Size'>
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
                         margins={{
                           left: 80
                         }}

                         y1={{
                           metrics: dbs.map((name) =>
                                      'dbs.' + name
                                    ).toArray(),
                           labels: dbs.map((name) =>
                                      name
                                    ).toArray(),
                           type: 'line',
                           formatter: bytesZeroDecimalPlaces,
                           tooltipFormatter: bytesTwoDecimalPlaces
                         }}/>
      </DashboardSection>
      : null}

      <DashboardSection title='Document Counter'>
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
                         margins={{
                           left: 80
                         }}
                         y1={{
                           metrics: [
                             'documents.deleted',
                             'documents.inserted',
                             'documents.returned',
                             'documents.updated'
                           ],
                           labels: [
                             'Deleted',
                             'Inserted',
                             'Returned',
                             'Updated'
                           ],
                           type: 'line'
                         }}/>
      </DashboardSection>

      <DashboardSection title='Clients'>
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
                         margins={{
                           left: 80
                         }}
                         y1={{
                           min: 0,
                           metrics: [
                             'connections'
                           ],
                           labels: [
                             'Connections'
                           ],
                           type: 'line'
                       }}/>
      </DashboardSection>
    </div>
  );
}

MongoDBDashboard.propTypes = {
  snapshot: irpt.map.isRequired,
  timeframe: timeframeShape
};
