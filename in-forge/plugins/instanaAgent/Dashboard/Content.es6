import React from 'react';

import {
  bytesTwoDecimalPlaces
} from 'in-services/formatters/number';

import LogStreamer from 'in-forge/plugins/instanaAgent/Dashboard/LogStreamer';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';

export default function InstanaAgentDashboard({snapshot, timeframe}) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <DashboardSection title='Memory'>
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
                         margins={{
                           left: 100
                         }}
                         y1={{
                           min: 0,
                           max: snapshot.getIn(['data', 'memory.total']),
                           formatter: bytesTwoDecimalPlaces,
                           tooltipFormatter: bytesTwoDecimalPlaces,
                           metrics: [
                             'memory.used'
                           ],
                           labels: [
                             'Used'
                           ],
                           type: 'stackedArea'
                         }}/>
      </DashboardSection>

      <DashboardSection title='Sensors'>
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
                         margins={{
                           left: 100
                         }}
                         y1={{
                           min: 0,
                           metrics: [
                             'sensors.time',
                             'discovery.time'
                           ],
                           labels: [
                             'Sensor time',
                             'Discovery time'
                           ],
                           type: 'line'
                         }}
                         y2={{
                           min: 0,
                           metrics: [
                             'sensors.count',
                             'discovery.count'
                           ],
                           labels: [
                             'Sensor Count',
                             'Discovery Count'
                           ],
                           type: 'line'
                         }}/>
      </DashboardSection>

      <DashboardSection title='Log Output'>
        <LogStreamer snapshot={snapshot}/>
      </DashboardSection>
    </div>
  );
}
