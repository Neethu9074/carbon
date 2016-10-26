import React from 'react';

import ChartWithLegend from 'in-components/ChartWithLegend';
import {twoDecimalPlaces} from 'in-services/formatters/number';
import TwoColumnRow from 'in-sdk/components/dashboard/TwoColumnRow';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';

export default function RubyDashboard({snapshot, timeframe}) {
  return (
    <div>
      <TwoColumnRow>
        <DashboardSection title='GC Activity'>
          <GcMetrics snapshot={snapshot} timeframe={timeframe} />
        </DashboardSection>
      </TwoColumnRow>
      <TwoColumnRow>
        <DashboardSection title='Time Spent in GC'>
          <GcTime snapshot={snapshot} timeframe={timeframe} />
        </DashboardSection>
      </TwoColumnRow>
      <TwoColumnRow>
        <DashboardSection title='Memory Usage'>
          <MemoryMetrics snapshot={snapshot} timeframe={timeframe} />
        </DashboardSection>
      </TwoColumnRow>
      <TwoColumnRow>
        <DashboardSection title='Threads'>
          <ThreadMetrics snapshot={snapshot} timeframe={timeframe} />
        </DashboardSection>
      </TwoColumnRow>
    </div>
  );
}

function GcMetrics({snapshot, timeframe}) {
    return (
      <ChartWithLegend snapshotId={snapshot.get('id')}
                       timeframe={timeframe}
                       margins={{
                         left: 60,
                         right: 60
                       }}

                       y1={{
                         min: 0,
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
                         formatter: twoDecimalPlaces,
                         metrics: [
                           'gc.totalTime'
                         ],
                         labels: [
                           '#GC Run Duration'
                         ],
                         type: 'point'
                       }}/>
    );
}

function MemoryMetrics({snapshot, timeframe}) {
    return (
      <ChartWithLegend snapshotId={snapshot.get('id')}
                       timeframe={timeframe}
                       margins={{
                         left: 60,
                         right: 60
                       }}

                       y1={{
                         min: 0,
                         formatter: twoDecimalPlaces,
                         metrics: [
                           'memory.size_kb'
                         ],
                         labels: [
                           '#RSS Size'
                         ],
                         type: 'line'
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
                         formatter: twoDecimalPlaces,
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
