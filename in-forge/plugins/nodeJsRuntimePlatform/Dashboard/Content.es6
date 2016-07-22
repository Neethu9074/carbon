import irpt from 'react-immutable-proptypes';
import React from 'react';

import HeapSpacesTable from 'in-forge/plugins/nodeJsRuntimePlatform/Dashboard/HeapSpacesTable';
import DashboardNotification from 'in-components/DashboardNotification';
import TwoColumnRow from 'in-sdk/components/dashboard/TwoColumnRow';
import * as numberFormatters from 'in-services/formatters/number';
import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import {timeframeShape} from 'in-stores/timeline';


export default function NodejsDashboard({snapshot, timeframe}) {
  return (
    <div>
      {getNativeExtensionHint(snapshot)}

      <TwoColumnRow>
        <DashboardSection title='Memory Usage'>
          {renderGcMetrics(snapshot, timeframe)}
        </DashboardSection>
        <DashboardSection title='GC Activity'>
          <ChartWithLegend snapshotId={snapshot.get('id')}
                           timeframe={timeframe}
                           height={150}
                           margins={{
                             left: 60
                           }}

                           y1={{
                             min: 0,
                             formatter: numberFormatters.time,
                             metrics: [
                               'gc.gcPause'
                             ],
                             labels: [
                               'GC Pause'
                             ],
                             type: 'stackedArea'
                           }}/>
        </DashboardSection>
      </TwoColumnRow>

      <HeapSpacesTable snapshot={snapshot}
                       timeframe={timeframe} />

      <DashboardSection title='Event Loop'>
        {renderEventLoopMetrics(snapshot, timeframe)}
      </DashboardSection>
    </div>
  );
}

function renderGcMetrics(snapshot, timeframe) {
  if (snapshot.getIn(['data', 'gc.statsSupported'])) {
    return (
      <ChartWithLegend snapshotId={snapshot.get('id')}
                       timeframe={timeframe}
                       height={150}
                       margins={{
                         left: 60,
                         right: 60
                       }}

                       y1={{
                         min: 0,
                         formatter: numberFormatters.bytesZeroDecimalPlaces,
                         tooltipFormatter: numberFormatters.bytesTwoDecimalPlaces,
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
                         formatter: numberFormatters.twoDecimalPlaces,
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
                     height={150}
                     margins={{
                       left: 60
                     }}

                     y1={{
                       min: 0,
                       formatter: numberFormatters.bytesZeroDecimalPlaces,
                       tooltipFormatter: numberFormatters.bytesTwoDecimalPlaces,
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
                       height={150}
                       margins={{
                         left: 60,
                         right: 60
                       }}

                       y1={{
                         min: 0,
                         formatter: numberFormatters.time,
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
                         formatter: numberFormatters.zeroDecimalPlaces,
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
                     height={150}
                     margins={{
                       left: 60
                     }}

                     y1={{
                       min: 0,
                       formatter: numberFormatters.time,
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
      <a href='http://docs.instana.com/articles/instana-agent-nodejs.html'>
        Node.js sensor installation instructions
      </a>.
    </DashboardNotification>
  );
}

NodejsDashboard.propTypes = {
  snapshot: irpt.map.isRequired,
  timeframe: timeframeShape
};
