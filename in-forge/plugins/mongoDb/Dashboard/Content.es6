import React from 'react';

import {bytesZeroDecimalPlaces, bytesTwoDecimalPlaces} from 'in-services/formatters/number';
import {KpiSection, KpiHeading, KpiKeyValue} from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import DashboardNotification from 'in-components/DashboardNotification';
import ChartWithLegend from 'in-components/ChartWithLegend';
import {emptyList} from 'in-services/fixedImmutables';
import MetricValue from 'in-components/MetricValue';
import {getLabel} from 'in-sdk/snapshot';


export default function MongoDBDashboard({snapshot, timeframe}) {
  const dbs = snapshot.getIn(['data', 'databases']);
  const snapshotId = snapshot.get('id');
  const sensorConnectionProblems = snapshot.getIn(['data', 'sensorConnectionProblems'], emptyList);
  if (sensorConnectionProblems.size > 0) {
    return (
      <DashboardNotification type='info'>
        {sensorConnectionProblems.map(problem =>
          <div>
            {problem}
          </div>)
        }
      </DashboardNotification>);
  }

  return (
    <div>
      <KpiSection>
        <KpiHeading>
          {getLabel(snapshot)}
        </KpiHeading>
        <KpiKeyValue label='Connections'>
          <MetricValue snapshotId={snapshotId}
                       metric='connections' />
        </KpiKeyValue>
        <KpiKeyValue label='DB Size'>
          <MetricValue snapshotId={snapshotId}
                       metric='totalDbSize' />
        </KpiKeyValue>
      </KpiSection>

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
