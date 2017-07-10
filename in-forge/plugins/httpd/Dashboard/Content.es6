import semver from 'semver';
import React from 'react';

import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import DashboardNotification from 'in-components/DashboardNotification';
import Chart from 'in-components/Chart'
import MetricValue from 'in-components/MetricValue';

import { bytesZeroDecimalPlaces, percentageZeroDecimalPlaces } from 'in-services/formatters/number';

export default function HttpdDashboard({ snapshot, timeframe }) {
  const status = snapshot.getIn(['data', 'server-status']);
  const ver = snapshot.getIn(['data', 'version']).replace(/[^\d.]/g, '');
  const snapshotId = snapshot.get('id');

  if (status !== 'OK' && status !== 'EXTENDED_INFO_DISABLED') {
    if (!status) {
      return (
        <DashboardNotification type="info">
          There is no further information about this entity.
        </DashboardNotification>
      );
    }
    return (
      <DashboardNotification type="warning">
        {status}
      </DashboardNotification>
    );
  }
  return (
    <div>
      <KpiSection>
        <KpiHeading>{snapshot.getIn(['data', 'version'])}</KpiHeading>
        {status !== 'EXTENDED_INFO_DISABLED'
          ? <KpiKeyValue label="Requests">
              <MetricValue snapshotId={snapshotId} metric="requests" />
            </KpiKeyValue>
          : null}
        {status !== 'EXTENDED_INFO_DISABLED'
          ? <KpiKeyValue label="kBytes Traffic">
              <MetricValue snapshotId={snapshotId} metric="kBytes" />
            </KpiKeyValue>
          : null}
        <KpiKeyValue label="Busy Worker">
          <MetricValue snapshotId={snapshotId} metric="busy_workers" />
        </KpiKeyValue>
      </KpiSection>

      {extendedStatusInfo(status, ver)}

      {status !== 'EXTENDED_INFO_DISABLED'
        ? <DashboardSection title="Traffic">
            <Chart
              snapshotId={snapshot.get('id')}
              timeframe={timeframe}
              margins={{
                left: 80,
                right: 60
              }}
              y1={{
                metrics: ['requests'],
                labels: ['Requests'],
                type: 'line'
              }}
              y2={{
                metrics: ['kBytes'],
                labels: ['kBytes'],
                type: 'line'
              }}
            />
          </DashboardSection>
        : null}

      {snapshot.getIn(['data', 'mpm']) === 'event' && semver.satisfies(ver, '>=2.3.0')
        ? <DashboardSection title="Connections">
            <Chart
              snapshotId={snapshot.get('id')}
              timeframe={timeframe}
              margins={{
                left: 50,
                right: 40
              }}
              y1={{
                min: 0,
                metrics: ['conns_total'],
                labels: ['Connections'],
                type: 'line'
              }}
              y2={{
                min: 0,
                metrics: ['conns_async_writing', 'conns_async_keep_alive', 'conns_async_closing'],
                labels: ['Async Connections Writing', 'Async Connections Keep-alive', 'Async Connections Closing'],
                type: 'line'
              }}
            />
          </DashboardSection>
        : null}

      <DashboardSection title="Worker">
        <Chart
          snapshotId={snapshot.get('id')}
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
          }}
        />
      </DashboardSection>

      {status !== 'EXTENDED_INFO_DISABLED'
        ? <div>
            <DashboardSection title="CPU">
              <Chart
                snapshotId={snapshot.get('id')}
                timeframe={timeframe}
                margins={{
                  left: 60
                }}
                y1={{
                  min: 0,
                  metrics: ['cpu_load'],
                  labels: ['CPU load'],
                  type: 'line',
                  formatter: percentageZeroDecimalPlaces
                }}
              />
            </DashboardSection>
            <DashboardSection title="Traffic per Request">
              <Chart
                snapshotId={snapshot.get('id')}
                timeframe={timeframe}
                margins={{
                  left: 60
                }}
                y1={{
                  min: 0,
                  metrics: ['bytes_per_req'],
                  labels: ['Traffic per request'],
                  type: 'line',
                  formatter: bytesZeroDecimalPlaces
                }}
              />
            </DashboardSection>
          </div>
        : null}

    </div>
  );
}

function extendedStatusInfo(status, ver) {
  if (status !== 'EXTENDED_INFO_DISABLED') {
    return null;
  }

  return (
    <DashboardNotification type="info">
      In order to display metrics such as:
      Traffic, Traffic per Request and CPU,
      &nbsp;<strong>ExtendedStatus</strong> flag should be&nbsp;
      <strong>enabled</strong> in apache httpd configuration.&nbsp;
      <a target="_blank" href={getModStatusDoc(ver)} rel="noopener noreferrer">
        Apache ExtendedStatus Directive
      </a>.
    </DashboardNotification>
  );
}

function getModStatusDoc(v) {
  if (semver.satisfies(v, '>=2.4.0')) {
    return 'https://httpd.apache.org/docs/2.4/mod/core.html#extendedstatus';
  } else if (semver.satisfies(v, '>=2.2.0')) {
    return 'https://httpd.apache.org/docs/2.2/mod/core.html#extendedstatus';
  } else if (semver.satisfies(v, '>=2.0.0')) {
    return 'https://httpd.apache.org/docs/2.0/mod/core.html#extendedstatus';
  }
  return 'http://httpd.apache.org/docs/current/mod/mod_status.html#extendedstatus';
}
