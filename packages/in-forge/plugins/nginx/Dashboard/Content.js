/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { twoDecimalPlaces } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import Code from 'in-components/Code';
import { t, Trans } from 'in-i18n';

const stubStatusSampleConfig = `location /nginx_status {
  stub_status  on;
  access_log   off;
}`;

const apiDirectiveSampleConfig = `location /api {
  api write=off;
}`;

export default function NginxDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const stubStatusUrlFound = snapshot.getIn(['data', 'stubStatusUrlFound']);
  const errorCode = snapshot.getIn(['data', 'error_code']);
  const statusUrl = snapshot.getIn(['data', 'status_url']);
  const isNginxPlus = snapshot.getIn(['data', 'version'], 'nginx').indexOf('nginx-plus') !== -1;

  if (errorCode === 'CONFIG_FILE_NOT_ACCESSIBLE') {
    return (
      <DashboardNotification type="warning">
        <strong>{t('in-forge:plugins.nginx.nginxConfigurationFileNotAccessibleHeader')}</strong>
        <p>
          <Trans i18nKey="in-forge:plugins.nginx.nginxConfigurationFileNotAccessibleDesc" />
        </p>
        <p>
          {t(
            'in-forge:plugins.nginx.thisFileNeedsToBeAccessibleInOrderToIdentifyTheUrlUnderWhichNginxIsExposingStatusInformation'
          )}
        </p>
      </DashboardNotification>
    );
  } else if (errorCode === 'STATUS_LOCATION_NOT_FOUND') {
    return (
      <DashboardNotification type="warning">
        <strong>{t('in-forge:plugins.nginx.statusUrlNotFoundHeader')}</strong>

        <p>
          <Trans i18nKey="in-forge:plugins.nginx.statusUrlNotFoundDesc" />
        </p>

        <Code code={stubStatusSampleConfig} />
      </DashboardNotification>
    );
  } else if (errorCode === 'STATUS_LOCATION_NOT_ACCESSIBLE') {
    return (
      <DashboardNotification type="warning">
        <strong>{t('in-forge:plugins.nginx.statusUrlNotAccessibleHeader')}</strong>
        <p>
          <Trans i18nKey="in-forge:plugins.nginx.statusUrlNotAccessibleDesc" values={{ statusUrl }} />
        </p>
      </DashboardNotification>
    );
  } else if (stubStatusUrlFound === false) {
    return (
      <DashboardNotification type="warning">
        <p>
          <Trans i18nKey="in-forge:plugins.nginx.aCodeStubStatusCodeDirectiveCouldNotFoundWithinTheNginxConfiguration" />
        </p>
        <Code code={stubStatusSampleConfig} />
      </DashboardNotification>
    );
  } else if (errorCode === 'API_LOCATION_NOT_ACCESSIBLE') {
    return (
      <DashboardNotification type="warning">
        <strong>{t('in-forge:plugins.nginx.ngnixPlusApiUrlNotAccessibleHeader')}</strong>
        <p>
          <Trans i18nKey="in-forge:plugins.nginx.ngnixPlusApiUrlNotAccessibleDesc" />
        </p>
      </DashboardNotification>
    );
  } else if (errorCode === 'API_LOCATION_NOT_FOUND') {
    return (
      <DashboardNotification type="warning">
        <strong>{t('in-forge:plugins.nginx.apiUrlNotFoundHeader')}</strong>

        <p>
          <Trans i18nKey="in-forge:plugins.nginx.apiUrlNotFoundDesc" />
        </p>

        <Code code={apiDirectiveSampleConfig} />
      </DashboardNotification>
    );
  }

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.nginx.requestsPerSecond')}>
          <MetricValue snapshotId={snapshotId} metric="requests" />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.nginx.connectionsReading')}>
          <MetricValue snapshotId={snapshotId} metric="connections.reading" />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.nginx.connectionsWriting')}>
          <MetricValue snapshotId={snapshotId} metric="connections.writing" />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.nginx.connectionsWaiting')}>
          <MetricValue snapshotId={snapshotId} metric="connections.waiting" />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title={t('in-forge:plugins.nginx.requestsPerSecond')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['requests'],
            labels: [t('in-forge:plugins.nginx.requests')],
            type: 'line',
            formatter: twoDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      {isNginxPlus && (
        <DashboardSection title={t('in-forge:plugins.nginx.responsesForServerZones')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['nginx_plus.http.server_zones.5xx_responses'],
              labels: ['5xx responses per second'],
              type: 'line',
              formatter: twoDecimalPlaces
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      )}

      <DashboardSection title={t('in-forge:plugins.nginx.connections')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['connections.accepted', 'connections.handled', 'connections.active', 'connections.dropped'],
            labels: [
              t('in-forge:plugins.nginx.accepted'),
              t('in-forge:plugins.nginx.handled'),
              t('in-forge:plugins.nginx.active'),
              t('in-forge:plugins.nginx.dropped')
            ],
            type: 'line',
            formatter: twoDecimalPlaces
          }}
          y2={{
            min: 0,
            metrics: ['connections.reading', 'connections.writing', 'connections.waiting'],
            labels: [
              t('in-forge:plugins.nginx.reading'),
              t('in-forge:plugins.nginx.writing'),
              t('in-forge:plugins.nginx.waiting')
            ],
            type: 'line',
            formatter: twoDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      {isNginxPlus && (
        <DashboardSection title={t('in-forge:plugins.nginx.caches')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: [
                'nginx_plus.http.caches.miss.responses',
                'nginx_plus.http.caches.hit.responses',
                'nginx_plus.http.caches.size',
                'nginx_plus.http.caches.max_size',
                'nginx_plus.http.caches.cold'
              ],
              labels: [
                t('in-forge:plugins.nginx.missesPerSecond'),
                t('in-forge:plugins.nginx.hitsPerSecond'),
                t('in-forge:plugins.nginx.cachesSize'),
                t('in-forge:plugins.nginx.maxCacheSize'),
                t('in-forge:plugins.nginx.numberOfColdCaches')
              ],
              type: 'line',
              formatter: twoDecimalPlaces
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      )}

      {isNginxPlus && (
        <DashboardSection title={t('in-forge:plugins.nginx.ssl')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: [
                'nginx_plus.ssl.handshakes',
                'nginx_plus.ssl.handshakes_failed',
                'nginx_plus.ssl.session_reuses'
              ],
              labels: [
                t('in-forge:plugins.nginx.handshakes'),
                t('in-forge:plugins.nginx.failedHanshakes'),
                t('in-forge:plugins.nginx.sessionReuses')
              ],
              type: 'line',
              formatter: twoDecimalPlaces
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      )}

      {isNginxPlus && (
        <DashboardSection title={t('in-forge:plugins.nginx.processesAndUpstreams')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['nginx_plus.processes.respawned', 'nginx_plus.http.upstreams.peers.failed'],
              labels: [t('in-forge:plugins.nginx.processesRespawned'), t('in-forge:plugins.nginx.upstreamsFailed')],
              type: 'line',
              formatter: twoDecimalPlaces
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      )}
    </div>
  );
}
