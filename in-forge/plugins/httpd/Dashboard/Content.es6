import semver from 'semver';
import React from 'react';

import DashboardNotification from 'in-components/DashboardNotification';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';

import {
  bytesZeroDecimalPlaces,
  percentageZeroDecimalPlaces
} from 'in-services/formatters/number';

export default function HttpdDashboard({snapshot, timeframe}) {
  const status = snapshot.getIn(['data', 'server-status']);
  const ver = snapshot.getIn(['data', 'version']).replace(/[^\d.]/g, '');

  if (status !== 'OK' && status !== 'EXTENDED_INFO_DISABLED') {
    return (
      <DashboardNotification type='warning'>
        {status}
      </DashboardNotification>
    );
  }
  return (
    <div>
      {extendedStatusInfo(status)}

      { status !== 'EXTENDED_INFO_DISABLED' ?
        <div>
          <DashboardSection title='Traffic'>
            <ChartWithLegend snapshotId={snapshot.get('id')}
                             timeframe={timeframe}
                             margins={{
                               left: 80,
                               right: 60
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
          </DashboardSection>
          <DashboardSection title='Traffic per Request'>
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
        </div>
      : null }

      { semver.satisfies(ver, '>=2.3.0') ?
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
      : null }

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

function extendedStatusInfo(status) {
  if (status !== 'EXTENDED_INFO_DISABLED') {
    return null;
  }

  return (
     <DashboardNotification type='info'>
       <p>In order to display metrics such as:
       Traffic, Traffic per Request and CPU,
       &nbsp;<strong>ExtendedStatus</strong> flag should be&nbsp;
       <strong>enabled</strong> in apache httpd configuration.</p>
       <a target='_blank'
       href='https://httpd.apache.org/docs/2.4/mod/core.html#extendedstatus'>
         Apache ExtendedStatus Directive
       </a>.
     </DashboardNotification>
  );
}
