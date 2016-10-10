import React from 'react';

import {
  bytesTwoDecimalPlaces,
  bytesPerSecondTwoDecimalPlaces
} from 'in-services/formatters/number';

import {KpiSection, KpiHeading, KpiTopLevelInteraction} from 'in-sdk/components/dashboard/KpiSection';
import LogStreamer from 'in-forge/plugins/instanaAgent/Dashboard/LogStreamer';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import {stop} from 'in-forge/plugins/instanaAgent/selfMonitoring';
import ChartWithLegend from 'in-components/ChartWithLegend';

export default function InstanaAgentDashboard({snapshot, timeframe}) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiHeading>Instana Agent on {snapshot.getIn(['entityId', 'host'])}</KpiHeading>

        <KpiTopLevelInteraction onClick={() => stop(snapshot)}>
          Stop Self Monitoring
        </KpiTopLevelInteraction>
      </KpiSection>
      {snapshot.getIn(['data', 'hasCpuLoad']) ?
        <DashboardSection title='CPU Load'>
          <ChartWithLegend snapshotId={snapshot.get('id')}
                           timeframe={timeframe}
                           margins={{
                             left: 60
                           }}
                           y1={{
                             min: 0,
                             type: 'stackedArea',
                             metrics: [
                               'cpu.load'
                             ],
                             labels: ['Load']
                           }}/>
        </DashboardSection>
      : null}
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
                           type: 'line'
                         }}
                         y2={{
                           min: 0,
                           max: snapshot.getIn(['data', 'memory.nativeTotal']),
                           formatter: bytesTwoDecimalPlaces,
                           tooltipFormatter: bytesTwoDecimalPlaces,
                           metrics: [
                             'memory.nativeUsed'
                           ],
                           labels: [
                             'Native Used'
                           ],
                           type: 'line'
                         }}/>
      </DashboardSection>
      <DashboardSection title='Network'>
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
                         margins={{
                           left: 100
                         }}
                         y1={{
                           min: 0,
                           formatter: bytesPerSecondTwoDecimalPlaces,
                           tooltipFormatter: bytesPerSecondTwoDecimalPlaces,
                           metrics: [
                             'net.rx',
                             'net.tx'
                           ],
                           labels: [
                             'Received',
                             'Sent'
                           ],
                           type: 'line'
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
