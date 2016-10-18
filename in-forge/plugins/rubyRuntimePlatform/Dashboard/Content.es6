import React from 'react';

import {time, bytesZeroDecimalPlaces, bytesTwoDecimalPlaces, twoDecimalPlaces} from 'in-services/formatters/number';
import HttpServersTable from 'in-forge/plugins/rubyRuntimePlatform/Dashboard/HttpServersTable';
import HeapSpacesTable from 'in-forge/plugins/rubyRuntimePlatform/Dashboard/HeapSpacesTable';
import {KpiSection, KpiHeading, KpiKeyValue} from 'in-sdk/components/dashboard/KpiSection';
import CpuProfiler from 'in-forge/plugins/rubyRuntimePlatform/Dashboard/CpuProfiler';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import DashboardNotification from 'in-components/DashboardNotification';
import TwoColumnRow from 'in-sdk/components/dashboard/TwoColumnRow';
import ChartWithLegend from 'in-components/ChartWithLegend';
import MetricValue from 'in-components/MetricValue';
import {getLabel} from 'in-sdk/snapshot';


export default function RubyDashboard({snapshot, timeframe}) {
  const snapshotId = snapshot.get('id');
  const gcStatsSupported = snapshot.getIn(['data', 'gc.statsSupported']);
  return (
    <div>
      {getNativeExtensionHint(snapshot)}

      <KpiSection>
        <KpiHeading>
          {getLabel(snapshot)}
        </KpiHeading>
        {gcStatsSupported ?
          <KpiKeyValue label='GC Pause'>
            <MetricValue snapshotId={snapshotId}
                         metric='gc.gcPause'
                         formatter={time} />
          </KpiKeyValue>
        : null}
        <KpiKeyValue label='RSS'>
          <MetricValue snapshotId={snapshotId}
                       metric='memory.rss'
                       formatter={bytesZeroDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label='Heap Used'>
          <MetricValue snapshotId={snapshotId}
                       metric='memory.heapUsed'
                       formatter={bytesTwoDecimalPlaces} />
        </KpiKeyValue>
        {snapshot.getIn(['data', 'libuv.statsSupported']) ?
          <KpiKeyValue label='Total time spent in loop per second'>
            <MetricValue snapshotId={snapshotId}
                         metric='libuv.num'
                         formatter={time} />
          </KpiKeyValue>
        : null}
        <KpiKeyValue label='Event loop lag'>
          <MetricValue snapshotId={snapshotId}
                       metric='libuv.lag'
                       formatter={time} />
        </KpiKeyValue>
      </KpiSection>

      <TwoColumnRow>
        <DashboardSection title='Memory Usage'>
          {renderGcMetrics(snapshot, timeframe)}
        </DashboardSection>

        {gcStatsSupported ?
          <DashboardSection title='GC Activity'>
            <ChartWithLegend snapshotId={snapshot.get('id')}
                             timeframe={timeframe}
                             margins={{
                               left: 60
                             }}

                             y1={{
                               min: 0,
                               formatter: time,
                               metrics: [
                                 'gc.gcPause'
                               ],
                               labels: [
                                 'GC Pause'
                               ],
                               type: 'stackedArea'
                             }}/>
          </DashboardSection>
        : null}
      </TwoColumnRow>

      <HeapSpacesTable snapshot={snapshot}
                       timeframe={timeframe} />

      <DashboardSection title='Event Loop'>
        {renderEventLoopMetrics(snapshot, timeframe)}
      </DashboardSection>

      <CpuProfiler snapshot={snapshot} />

      <HttpServersTable snapshot={snapshot}
                        timeframe={timeframe} />
    </div>
  );
}

function renderGcMetrics(snapshot, timeframe) {
  if (snapshot.getIn(['data', 'gc.statsSupported'])) {
    return (
      <ChartWithLegend snapshotId={snapshot.get('id')}
                       timeframe={timeframe}
                       margins={{
                         left: 60,
                         right: 60
                       }}

                       y1={{
                         min: 0,
                         formatter: bytesTwoDecimalPlaces,
                         metrics: [
                           'memory.rss',
                           'memory.heapUsed',
                           'gc.usedHeapSizeAfterGc'
                         ],
                         labels: [
                           'RSS',
                           'Heap Size',
                           'Heap Size After GC'
                         ],
                         type: 'line'
                       }}

                       y2={{
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

  return (
    <ChartWithLegend snapshotId={snapshot.get('id')}
                     timeframe={timeframe}
                     margins={{
                       left: 60
                     }}

                     y1={{
                       min: 0,
                       formatter: bytesZeroDecimalPlaces,
                       tooltipFormatter: bytesTwoDecimalPlaces,
                       metrics: [
                         'memory.rss',
                         'memory.heapUsed'
                       ],
                       labels: [
                         'RSS',
                         'Heap Size'
                       ],
                       type: 'line'
                     }}/>
  );
}

function renderEventLoopMetrics(snapshot, timeframe) {
  if (snapshot.getIn(['data', 'libuv.statsSupported'])) {
    return (
      <ChartWithLegend snapshotId={snapshot.get('id')}
                       timeframe={timeframe}
                       margins={{
                         left: 60,
                         right: 60
                       }}

                       y1={{
                         min: 0,
                         formatter: time,
                         metrics: [
                           'libuv.max',
                           'libuv.sum',
                           'libuv.lag'
                         ],
                         labels: [
                           'Longest time spent in a single loop',
                           'Total time spent in loop',
                           'Event loop lag'
                         ],
                         type: 'line'
                       }}
                       y2={{
                         min: 0,
                         formatter: twoDecimalPlaces,
                         metrics: [
                           'libuv.num'
                         ],
                         labels: [
                           'Loops per second'
                         ],
                         type: 'line'
                       }}/>
    );
  }

  return (
    <ChartWithLegend snapshotId={snapshot.get('id')}
                     timeframe={timeframe}
                     margins={{
                       left: 60
                     }}

                     y1={{
                       min: 0,
                       formatter: time,
                       metrics: [
                         'libuv.lag'
                       ],
                       labels: [
                         'Event loop lag'
                       ],
                       type: 'line'
                     }}/>
  );
}

function getNativeExtensionHint(snapshot) {
  const libuvMonitoringSupported = snapshot.getIn(['data', 'libuv.statsSupported']);
  const gcMonitoringSupported =  snapshot.getIn(['data', 'gc.statsSupported']);

  if (libuvMonitoringSupported && gcMonitoringSupported) {
    return null;
  }

  const missingNativeExtensions = [];
  if (!libuvMonitoringSupported) {
    missingNativeExtensions.push('event loop');
  }

  if (!gcMonitoringSupported) {
    missingNativeExtensions.push('garbage collection');
  }

  return (
    <DashboardNotification type='info'>
      Native extensions could not be loaded for detailed{' '}
      <strong>{missingNativeExtensions.join(' and ')}</strong>{' '}monitoring. As a result, Instana
      can only show you a limited set of metrics. Please contact us for installation support or
      refer to the{' '}
      <a href='https://github.com/instana/ruby-sensor'>
        Ruby sensor installation instructions
      </a>.
    </DashboardNotification>
  );
}
