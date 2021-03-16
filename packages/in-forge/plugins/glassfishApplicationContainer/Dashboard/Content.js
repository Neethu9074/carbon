/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { zeroDecimalPlaces, hitRateZeroDecimalPlaces, msZeroDecimalPlaces } from 'in-services/formatters/number';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function GlassfishDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const version = snapshot.getIn(['data', 'version']);
  if (!version) {
    return (
      <DashboardNotification type="warning">
        {t(
          'in-forge:plugins.glassfishApplicationContainer.dashboard.amxModuleIsNotEnabledPleaseEnableTheAmxModuleToSupportMetricCollection'
        )}
      </DashboardNotification>
    );
  }
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.glassfishApplicationContainer.dashboard.requests')}>
          <MetricValue snapshotId={snapshotId} metric="http_request_count" formatter={zeroDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.glassfishApplicationContainer.dashboard.errors')}>
          <MetricValue snapshotId={snapshotId} metric="http_error" formatter={zeroDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.glassfishApplicationContainer.dashboard.maxTime')}>
          <MetricValue snapshotId={snapshotId} metric="http_max_time" formatter={msZeroDecimalPlaces} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.glassfishApplicationContainer.dashboard.webRequests')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['http_request_count', 'http_error'],
            labels: [
              t('in-forge:plugins.glassfishApplicationContainer.dashboard.requests'),
              t('in-forge:plugins.glassfishApplicationContainer.dashboard.errors')
            ],
            min: 0,
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
          y2={{
            metrics: ['http_max_time', 'http_proc_time'],
            labels: [
              t('in-forge:plugins.glassfishApplicationContainer.dashboard.maxTime'),
              t('in-forge:plugins.glassfishApplicationContainer.dashboard.processingTime')
            ],
            min: 0,
            type: 'line',
            formatter: msZeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.glassfishApplicationContainer.dashboard.connections')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: [
              'connections_open',
              'connections_overflows',
              'connections_queued',
              'connections_peak_queued',
              'connections_ticks_total_queued',
              'connections_total'
            ],
            labels: [
              t('in-forge:plugins.glassfishApplicationContainer.dashboard.open'),
              t('in-forge:plugins.glassfishApplicationContainer.dashboard.overflows'),
              t('in-forge:plugins.glassfishApplicationContainer.dashboard.queued'),
              t('in-forge:plugins.glassfishApplicationContainer.dashboard.peakQueued'),
              t('in-forge:plugins.glassfishApplicationContainer.dashboard.ticksTotalQueued'),
              t('in-forge:plugins.glassfishApplicationContainer.dashboard.total')
            ],
            min: 0,
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.glassfishApplicationContainer.dashboard.keepAlive')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: [
              'keep_alive_connections',
              'keep_alive_flushes',
              'keep_alive_hits',
              'keep_alive_refusals',
              'keep_alive_timeouts'
            ],
            labels: [
              t('in-forge:plugins.glassfishApplicationContainer.dashboard.connections'),
              t('in-forge:plugins.glassfishApplicationContainer.dashboard.flushes'),
              t('in-forge:plugins.glassfishApplicationContainer.dashboard.hits'),
              t('in-forge:plugins.glassfishApplicationContainer.dashboard.refusals'),
              t('in-forge:plugins.glassfishApplicationContainer.dashboard.timeouts')
            ],
            min: 0,
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.glassfishApplicationContainer.dashboard.fileCache')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['file_cache_hits', 'file_cache_misses', 'file_cache_info_hits', 'file_cache_info_misses'],
            labels: [
              t('in-forge:plugins.glassfishApplicationContainer.dashboard.hits'),
              t('in-forge:plugins.glassfishApplicationContainer.dashboard.misses'),
              t('in-forge:plugins.glassfishApplicationContainer.dashboard.infoHits'),
              t('in-forge:plugins.glassfishApplicationContainer.dashboard.infoMisses')
            ],
            min: 0,
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
          y2={{
            min: 0,
            max: 1,
            metrics: ['file_cache_rate', 'file_cache_info_rate'],
            labels: [
              t('in-forge:plugins.glassfishApplicationContainer.dashboard.hitRate'),
              t('in-forge:plugins.glassfishApplicationContainer.dashboard.infoHitRate')
            ],
            type: 'line',
            formatter: hitRateZeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.glassfishApplicationContainer.dashboard.jdbcConnections')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['jdbc_connection_used', 'jdbc_connection_free'],
            labels: [
              t('in-forge:plugins.glassfishApplicationContainer.dashboard.used'),
              t('in-forge:plugins.glassfishApplicationContainer.dashboard.free')
            ],
            min: 0,
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
