import irpt from 'react-immutable-proptypes';
import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import {timeframeShape} from 'in-stores/timeline';

import {
  bytesZeroDecimalPlaces,
  percentageZeroDecimalPlaces
} from 'in-services/formatters/number';


export default function HttpdDashboard({snapshot, timeframe}) {
  return (
    <div>
      <DashboardSection title='Traffic'>
        <ChartWithLegend snapshotId={snapshot.get('id')}
                         timeframe={timeframe}
                         margins={{
                           left: 80
                         }}
                         y1={{
                           metrics: [
                             'requests'
                           ],
                           labels: [
                             'Requests'
                           ],
                           type: 'line'
                         }}
                         y2={{
                           metrics: [
                             'kBytes'
                           ],
                           labels: [
                             'kBytes'
                           ],
                           type: 'line'
                         }}
                         />
        <ChartWithLegend snapshotId={snapshot.get('id')}
                         timeframe={timeframe}
                         margins={{
                           left: 60
                         }}
                         y1={{
                           min: 0,
                           metrics: [
                             'bytes_per_req'
                           ],
                           labels: [
                             'Traffic per request'
                           ],
                           type: 'line',
                           formatter: bytesZeroDecimalPlaces
                          }}/>
      </DashboardSection>
      <DashboardSection title='CPU'>
        <ChartWithLegend snapshotId={snapshot.get('id')}
                         timeframe={timeframe}
                         margins={{
                           left: 60
                         }}
                         y1={{
                           min: 0,
                           metrics: [
                             'cpu_load'
                           ],
                           labels: [
                             'CPU load'
                           ],
                           type: 'line',
                           formatter: percentageZeroDecimalPlaces
                         }}
                         />
      </DashboardSection>
      <DashboardSection title='Connections'>
        <ChartWithLegend snapshotId={snapshot.get('id')}
                         timeframe={timeframe}
                         margins={{
                           left: 50,
                           right: 40
                         }}
                         y1={{
                           min: 0,
                           metrics: [
                             'conns_total'
                           ],
                           labels: [
                            'Connections'
                           ],
                           type: 'line'
                         }}
                         y2={{
                           min: 0,
                           metrics: [
                             'conns_async_writing',
                             'conns_async_keep_alive',
                             'conns_async_closing'
                           ],
                           labels: [
                            'Async Connections Writing',
                            'Async Connections Keep-alive',
                            'Async Connections Closing'
                           ],
                           type: 'line'
                         }}
                         />
      </DashboardSection>
      <DashboardSection title='Worker'>
        <ChartWithLegend snapshotId={snapshot.get('id')}
                         timeframe={timeframe}
                         margins={{
                           left: 60
                         }}

                         y1={{
                           min: 0,
                           metrics: [
                             'worker.waiting',
                             'worker.starting',
                             'worker.reading',
                             'worker.writing',
                             'worker.keepalive',
                             'worker.dns',
                             'worker.closing',
                             'worker.logging',
                             'worker.graceful',
                             'worker.idle'
                           ],
                           labels: [
                             'Waiting',
                             'Starting',
                             'Reading',
                             'Writing',
                             'Keepalive',
                             'Dns',
                             'Closing',
                             'Logging',
                             'Graceful',
                             'Idle'
                           ],
                           type: 'stackedArea'
                         }}/>
      </DashboardSection>
    </div>
  );
}

HttpdDashboard.propTypes = {
  snapshot: irpt.map.isRequired,
  timeframe: timeframeShape
};
