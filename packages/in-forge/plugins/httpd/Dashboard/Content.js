/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import semver from 'semver';
import React from 'react';

import { bytesZeroDecimalPlaces, number, percentageZeroDecimalPlaces } from 'in-services/formatters/number';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import MetricValue from 'in-components/MetricValue';
import Link from 'in-components/Link';

export default function HttpdDashboard({ snapshot, timeConfig }) {
  const status = snapshot.getIn(['data', 'server-status']);
  const ver = (snapshot.getIn(['data', 'version']) || '').replace(/[^\d.]/g, '');
  const snapshotId = snapshot.get('id');

  if (status !== 'OK' && status !== 'EXTENDED_INFO_DISABLED') {
    if (!status) {
      return (
        <DashboardNotification type="info">There is no further information about this entity.</DashboardNotification>
      );
    }
    return <DashboardNotification type="warning">{status}</DashboardNotification>;
  }
  return (
    <div>
      <KpiSection>
        {status !== 'EXTENDED_INFO_DISABLED' ? (
          <KpiKeyValue label="Requests">
            <MetricValue snapshotId={snapshotId} metric="requests" formatter={number.compact} />
          </KpiKeyValue>
        ) : null}
        {status !== 'EXTENDED_INFO_DISABLED' ? (
          <KpiKeyValue label="kBytes Traffic">
            <MetricValue snapshotId={snapshotId} metric="kBytes" />
          </KpiKeyValue>
        ) : null}
        <KpiKeyValue label="Busy Workers">
          <MetricValue snapshotId={snapshotId} metric="busy_workers" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>

      {extendedStatusInfo(status, ver)}

      {status !== 'EXTENDED_INFO_DISABLED' ? (
        <DashboardSection title="Traffic">
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
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
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      ) : null}

      {snapshot.getIn(['data', 'mpm']) === 'event' && ver && semver.satisfies(semver.coerce(ver), '>=2.3.0') ? (
        <DashboardSection title="Connections">
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
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
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      ) : null}

      <DashboardSection title="Worker">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
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
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      {status !== 'EXTENDED_INFO_DISABLED' ? (
        <div>
          <DashboardSection title="CPU">
            <Chart
              snapshotId={snapshot.get('id')}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['cpu_load'],
                labels: ['CPU load'],
                type: 'line',
                formatter: percentageZeroDecimalPlaces
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
          <DashboardSection title="Traffic per Request">
            <Chart
              snapshotId={snapshot.get('id')}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['bytes_per_req'],
                labels: ['Traffic per request'],
                type: 'line',
                formatter: bytesZeroDecimalPlaces
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        </div>
      ) : null}
    </div>
  );
}

function extendedStatusInfo(status, ver) {
  if (status !== 'EXTENDED_INFO_DISABLED') {
    return null;
  }

  return (
    <DashboardNotification type="info">
      In order to display metrics such as: Traffic, Traffic per Request and CPU, &nbsp;
      <strong>ExtendedStatus</strong> flag should be&nbsp;
      <strong>enabled</strong> in Apache HTTPd configuration.&nbsp;
      <Link href={getModStatusDoc(semver.coerce(ver))} external>
        Apache ExtendedStatus Directive
      </Link>
      .
    </DashboardNotification>
  );
}

function getModStatusDoc(v) {
  if (v && semver.satisfies(v, '>=2.4.0')) {
    return 'https://httpd.apache.org/docs/2.4/mod/core.html#extendedstatus';
  } else if (v && semver.satisfies(v, '>=2.2.0')) {
    return 'https://httpd.apache.org/docs/2.2/mod/core.html#extendedstatus';
  } else if (v && semver.satisfies(v, '>=2.0.0')) {
    return 'https://httpd.apache.org/docs/2.0/mod/core.html#extendedstatus';
  }
  return 'http://httpd.apache.org/docs/current/mod/mod_status.html#extendedstatus';
}
