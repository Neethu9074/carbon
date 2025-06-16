/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import semver from 'semver';
import React from 'react';

import { Link } from '@instana/components';

import { bytesZeroDecimalPlaces, number, percentageZeroDecimalPlaces } from 'in-services/formatters/number';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import MetricValue from 'in-components/MetricValue';
import { Trans, t } from 'in-i18n';

export default function HttpdDashboard({ snapshot, timeConfig }) {
  const status = snapshot.getIn(['data', 'server-status']);
  const ver = (snapshot.getIn(['data', 'version']) || '').replace(/[^\d.]/g, '');
  const snapshotId = snapshot.get('id');

  if (status !== 'OK' && status !== 'EXTENDED_INFO_DISABLED') {
    if (!status) {
      return (
        <DashboardNotification type="info">
          {t('in-forge:plugins.httpd.dashboard.thereIsNoFurtherInformationAboutThisEntity')}
        </DashboardNotification>
      );
    }
    return <DashboardNotification type="warning">{status}</DashboardNotification>;
  }
  return (
    <div>
      <KpiSection>
        {status !== 'EXTENDED_INFO_DISABLED' ? (
          <KpiKeyValue label={t('in-forge:plugins.httpd.dashboard.requests')}>
            <MetricValue snapshotId={snapshotId} metric="requests" formatter={number.compact} />
          </KpiKeyValue>
        ) : null}
        {status !== 'EXTENDED_INFO_DISABLED' ? (
          <KpiKeyValue label={t('in-forge:plugins.httpd.dashboard.kBytesTraffic')}>
            <MetricValue snapshotId={snapshotId} metric="kBytes" />
          </KpiKeyValue>
        ) : null}
        <KpiKeyValue label={t('in-forge:plugins.httpd.dashboard.busyWorkers')}>
          <MetricValue snapshotId={snapshotId} metric="busy_workers" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>

      {extendedStatusInfo(status, ver)}

      {status !== 'EXTENDED_INFO_DISABLED' ? (
        <DashboardSection title={t('in-forge:plugins.httpd.dashboard.traffic')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              metrics: ['requests'],
              labels: [t('in-forge:plugins.httpd.dashboard.requests')],
              type: 'line'
            }}
            y2={{
              metrics: ['kBytes'],
              labels: [t('in-forge:plugins.httpd.dashboard.kBytes')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      ) : null}

      {snapshot.getIn(['data', 'mpm']) === 'event' && ver && semver.satisfies(semver.coerce(ver), '>=2.3.0') ? (
        <DashboardSection title={t('in-forge:plugins.httpd.dashboard.connections')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['conns_total'],
              labels: [t('in-forge:plugins.httpd.dashboard.connections')],
              type: 'line'
            }}
            y2={{
              min: 0,
              metrics: ['conns_async_writing', 'conns_async_keep_alive', 'conns_async_closing'],
              labels: [
                t('in-forge:plugins.httpd.dashboard.asyncConnectionsWriting'),
                'Async Connections Keep-alive',
                t('in-forge:plugins.httpd.dashboard.asyncConnectionsClosing')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      ) : null}

      <DashboardSection title={t('in-forge:plugins.httpd.dashboard.worker')}>
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
              t('in-forge:plugins.httpd.dashboard.waiting'),
              t('in-forge:plugins.httpd.dashboard.starting'),
              t('in-forge:plugins.httpd.dashboard.reading'),
              t('in-forge:plugins.httpd.dashboard.writing'),
              t('in-forge:plugins.httpd.dashboard.keepalive'),
              t('in-forge:plugins.httpd.dashboard.dns'),
              t('in-forge:plugins.httpd.dashboard.closing'),
              t('in-forge:plugins.httpd.dashboard.logging'),
              t('in-forge:plugins.httpd.dashboard.graceful'),
              t('in-forge:plugins.httpd.dashboard.idle')
            ],
            type: 'stackedArea'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      {status !== 'EXTENDED_INFO_DISABLED' ? (
        <div>
          <DashboardSection title={t('in-forge:plugins.httpd.dashboard.cpu')}>
            <Chart
              snapshotId={snapshot.get('id')}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['cpu_load'],
                labels: [t('in-forge:plugins.httpd.dashboard.cpuLoad')],
                type: 'line',
                formatter: percentageZeroDecimalPlaces
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
          <DashboardSection title={t('in-forge:plugins.httpd.dashboard.trafficPerRequest2')}>
            <Chart
              snapshotId={snapshot.get('id')}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['bytes_per_req'],
                labels: [t('in-forge:plugins.httpd.dashboard.trafficPerRequest')],
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
      <Trans
        i18nKey="in-forge:plugins.httpd.dashboard.inOrderToDisplayMetricsSuchAsTrafficTrafficPerRequestAndCpu"
        components={{
          linkToDocs: <Link href={getModStatusDoc(semver.coerce(ver))} external />
        }}
      />
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
  return 'https://httpd.apache.org/docs/current/mod/mod_status.html#extendedstatus';
}
