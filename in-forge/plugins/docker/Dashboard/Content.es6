import React from 'react';

import {
  zeroDecimalPlaces,
  bytesTwoDecimalPlaces,
  bytesZeroDecimalPlaces,
  percentageZeroDecimalPlaces
} from 'in-services/formatters/number';
import DashboardNotification from 'in-components/DashboardNotification';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';

const throttlingTimeFormater = d => (d / 1000000000.0) + 's';

export default function DockerDashboard({snapshot, timeframe}) {
  const dockerVersion = snapshot.getIn(['data', 'docker_version']);
  const hasNetworkMetrics = snapshot.getIn(['data', 'NetworkMode'], '') === 'bridge';
  const memoryMetricsBugged = dockerVersion === '1.11.0' || dockerVersion === '1.11.1';

  return (
    <div>
      {memoryMetricsBugged ?
        <DashboardNotification type='info'>
          Due to a regression in Docker 1.11.0 and 1.11.1, no memory metrics can be collected.
          This has been fixed by Docker in 1.12.0 and 1.11.2.
        </DashboardNotification>
      : null}
      <DashboardSection title='CPU'>
        <ChartWithLegend snapshotId={snapshot.get('id')}
                         timeframe={timeframe}
                         margins={{
                           left: 80,
                           right: 10
                         }}
                         y1={{
                           min: 0,
                           metrics: [
                             'cpu.total_usage',
                             'cpu.system_usage',
                             'cpu.user_usage'
                           ],
                           labels: [
                             'Total',
                             'Kernel',
                             'User'
                           ],
                           formatter: percentageZeroDecimalPlaces,
                           type: 'line'
                         }}/>
        <ChartWithLegend snapshotId={snapshot.get('id')}
                         timeframe={timeframe}
                         margins={{
                           left: 80,
                           right: 10
                         }}
                         y1={{
                           min: 0,
                           metrics: [
                             'cpu.throttling_count'
                           ],
                           labels: [
                             'Throttling count'
                           ],
                           type: 'line'
                         }}
                         y2={{
                           min: 0,
                           metrics: [
                             'cpu.throttling_time'
                           ],
                           labels: [
                             'Throttling time'
                           ],
                           type: 'line',
                           formatter: throttlingTimeFormater
                         }}/>
      </DashboardSection>
      { !memoryMetricsBugged ?
      <DashboardSection title='Memory'>
        <ChartWithLegend snapshotId={snapshot.get('id')}
                         timeframe={timeframe}
                         margins={{
                           left: 80,
                           right: 10
                         }}
                         y1={{
                           min: 0,
                           metrics: [
                             'memory.usage',
                             'memory.max_usage',
                             'memory.total_rss',
                             'memory.total_cache'
                           ],
                           labels: [
                             'Usage',
                             'Max usage',
                             'RSS',
                             'Cache'
                           ],
                           formatter: bytesTwoDecimalPlaces,
                           type: 'line'
                         }}/>
        <ChartWithLegend snapshotId={snapshot.get('id')}
                         timeframe={timeframe}
                         margins={{
                           left: 80,
                           right: 10
                         }}
                         y1={{
                           min: 0,
                           metrics: [
                             'memory.active_anon',
                             'memory.active_file',
                             'memory.inactive_anon',
                             'memory.inactive_file'
                           ],
                           labels: [
                             'active_anon',
                             'active_file',
                             'inactive_anon',
                             'inactive_file'
                           ],
                           formatter: bytesTwoDecimalPlaces,
                           type: 'line'
                         }}/>
      </DashboardSection>
      : null }
      <DashboardSection title='Block IO'>
        <ChartWithLegend snapshotId={snapshot.get('id')}
                         timeframe={timeframe}
                         margins={{
                           left: 80,
                           right: 10
                         }}
                         y1={{
                           min: 0,
                           metrics: [
                             'blkio.blk_read',
                             'blkio.blk_write'
                           ],
                           labels: [
                             'Read',
                             'Write'
                           ],
                           type: 'line',
                           formatter: zeroDecimalPlaces
                         }}/>
      </DashboardSection>
      { hasNetworkMetrics ?
      <DashboardSection title='Network'>
        <div>
          <ChartWithLegend snapshotId={snapshot.get('id')}
                 timeframe={timeframe}
                 margins={{
                   left: 80,
                   right: 80
                 }}

                 y1={{
                   min: 0,
                   formatter: bytesZeroDecimalPlaces,
                   metrics: [
                     'network.rx.bytes',
                     'network.tx.bytes'
                   ],
                   labels: [
                     'Received',
                     'Transmitted'
                   ],
                   type: 'line'
                 }}
                 y2={{
                   min: 0,
                   max: 1,
                   metrics: [
                     'network.rx.errors',
                     'network.rx.dropped',
                     'network.tx.errors',
                     'network.tx.dropped'
                   ],
                   labels: [
                     'RX Errors',
                     'RX Dropped',
                     'TX Errors',
                     'TX Dropped'
                   ],
                   formatter: percentageZeroDecimalPlaces,
                   type: 'line'
                 }}/>
        </div>
      </DashboardSection>
      : null }
    </div>
  );
}
