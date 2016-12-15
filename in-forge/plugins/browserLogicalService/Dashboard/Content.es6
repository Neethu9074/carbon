import irpt from 'react-immutable-proptypes';
import React from 'react';

import {
  msZeroDecimalPlaces,
  msTwoDecimalPlaces,
  zeroDecimalPlaces,
  twoDecimalPlaces
} from 'in-services/formatters/number';
import {KpiSection, KpiHeading, KpiKeyValue} from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ClusterNodes from 'in-components/LogicalEntityTables/ClusterNodes';
import Connections from 'in-components/LogicalEntityTables/Connections';
import ChartWithLegend from 'in-components/ChartWithLegend';
import MetricValue from 'in-components/MetricValue';
import {timeframeShape} from 'in-stores/timeline';
import {getLabel} from 'in-sdk/snapshot';


export default function DefaultLogicalServiceDashboard({snapshot, timeframe}) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiHeading>
          {getLabel(snapshot)}
        </KpiHeading>
        <KpiKeyValue label='calls/s'>
          <MetricValue snapshotId={snapshotId}
                       metric='count'
                       formatter={zeroDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label='load time'>
          <MetricValue snapshotId={snapshotId}
                       metric='duration.mean'
                       formatter={msTwoDecimalPlaces} />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title='Calls/s vs. Load Time'>
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
                         margins={{
                           left: 80,
                           right: 80
                         }}
                         y1={{
                           min: 0,
                           formatter: twoDecimalPlaces,
                           metrics: [
                             'count'
                           ],
                           labels: [
                             'calls/s'
                           ],
                           type: 'line'
                         }}
                         y2={{
                           min: 0,
                           formatter: msTwoDecimalPlaces,
                           metrics: [
                             'duration.mean'
                           ],
                           labels: [
                             'load time'
                           ],
                           type: 'line'
                         }} />
      </DashboardSection>

      <DashboardSection title='Latency Overview'>
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
                         height={200}
                         margins={{
                           left: 80
                         }}
                         y1={{
                           min: 0,
                           formatter: msZeroDecimalPlaces,
                           metrics: [
                             'duration.min',
                             'duration.25th',
                             'duration.50th',
                             'duration.75th',
                             'duration.95th',
                             'duration.98th',
                             'duration.99th',
                             'duration.max'
                           ],
                           labels: [
                             'min',
                             '25th',
                             '50th',
                             '75th',
                             '95th',
                             '98th',
                             '99th',
                             'max'
                           ],
                           type: 'integral'
                         }} />
      </DashboardSection>

      <ClusterNodes snapshotId={snapshotId}
                    timeframe={timeframe} />

      <Connections snapshotId={snapshotId}
                   timeframe={timeframe} />
    </div>
  );
}

DefaultLogicalServiceDashboard.propTypes = {
  snapshot: irpt.map.isRequired,
  timeframe: timeframeShape
};
