import React from 'react';

import {KpiSection, KpiHeading, KpiKeyValue} from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import TwoColumnRow from 'in-sdk/components/dashboard/TwoColumnRow';
import ChartWithLegend from 'in-components/ChartWithLegend';
import MetricValue from 'in-components/MetricValue';
import {getLabel} from 'in-sdk/snapshot';

import {
  zeroDecimalPlaces,
  twoDecimalPlaces,
  msTwoDecimalPlaces,
  kiloBytesZeroDecimalPlaces,
  kiloBytesTwoDecimalPlaces
} from 'in-services/formatters/number';

export default function RubyDashboard({snapshot, timeframe}) {
  return (
    <div>
      <KpiSection>
        <KpiHeading>
          {getLabel(snapshot)}
        </KpiHeading>
        <KpiKeyValue label='RSS'>
          <MetricValue snapshotId={snapshot.get('id')}
                       metric='memory.rss_size'
                       formatter={kiloBytesZeroDecimalPlaces} />
        </KpiKeyValue>
      </KpiSection>
      <TwoColumnRow>
        <DashboardSection title='Time Spent in GC'>
          <GcTime snapshot={snapshot} timeframe={timeframe} />
        </DashboardSection>
      </TwoColumnRow>
      <DashboardSection title='Memory'>
        <ChartWithLegend snapshotId={snapshot.get('id')}
               timeframe={timeframe}
               margins={{
                 left: 60,
                 right: 60
               }}
               y1={{
                 min: 0,
                 formatter: kiloBytesTwoDecimalPlaces,
                 metrics: [
                   'memory.rss_size'
                 ],
                 labels: [
                   'Resident'
                 ],
                 type: 'line'
               }}/>
      </DashboardSection>
      <DashboardSection title='Heap Slots'>
        <ChartWithLegend snapshotId={snapshot.get('id')}
               timeframe={timeframe}
               margins={{
                 left: 60,
                 right: 60
               }}
               y1={{
                 min: 0,
                 formatter: zeroDecimalPlaces,
                 metrics: [
                   'gc.heap_live',
                   'gc.heap_free'
                 ],
                 labels: [
                   'Live',
                   'Free'
                 ],
                 type: 'stackedArea'
               }}/>
      </DashboardSection>
      <TwoColumnRow>
        <DashboardSection title='Threads'>
          <ThreadMetrics snapshot={snapshot} timeframe={timeframe} />
        </DashboardSection>
      </TwoColumnRow>
    </div>
  );
}

function GcTime({snapshot, timeframe}) {
    return (
      <ChartWithLegend snapshotId={snapshot.get('id')}
                       timeframe={timeframe}
                       margins={{
                         left: 60,
                         right: 60
                       }}

                       y1={{
                         min: 0,
                         formatter: msTwoDecimalPlaces,
                         metrics: [
                           'gc.totalTime'
                         ],
                         labels: [
                           '#GC Run Duration'
                         ],
                         type: 'line'
                       }}
                       y2={{
                         min: 0,
                         tooltipFormatter: zeroDecimalPlaces,
                         formatter: twoDecimalPlaces,
                         metrics: [
                           'gc.minorGcs',
                           'gc.majorGcs'
                         ],
                         labels: [
                           '#Minor GCs',
                           '#Major GCs'
                         ],
                         type: 'point'
                       }}/>
    );
}

function ThreadMetrics({snapshot, timeframe}) {
    return (
      <ChartWithLegend snapshotId={snapshot.get('id')}
                       timeframe={timeframe}
                       margins={{
                         left: 60,
                         right: 60
                       }}

                       y1={{
                         min: 0,
                         formatter: zeroDecimalPlaces,
                         metrics: [
                           'thread.count'
                         ],
                         labels: [
                           '#Thread Count'
                         ],
                         type: 'line'
                       }}/>
    );
}
