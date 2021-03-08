/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import {
  twoDecimalPlaces,
  zeroDecimalPlaces,
  bytesZeroDecimalPlaces,
  hitRateZeroDecimalPlaces
} from 'in-services/formatters/number';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import MseTable from 'in-forge/plugins/varnish/Dashboard/MseTable';
import MetricValue from 'in-components/MetricValue';

export default function VarnishDashboard({ snapshot, timeConfig }) {
  const data = snapshot.get('data');
  const snapshotId = snapshot.get('id');
  const hasMse = data.get('mse');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.varnish.labelRequests')}>
          <MetricValue snapshotId={snapshotId} metric="client_req" formatter={zeroDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.varnish.labelCacheHitRate')}>
          <MetricValue snapshotId={snapshotId} metric="cache_hit_rate" formatter={hitRateZeroDecimalPlaces} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.varnish.titleClient')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['sess_conn', 'client_req', 'sess_dropped'],
            labels: [
              t('in-forge:plugins.varnish.labelAcceptedClientConnections'),
              t('in-forge:plugins.varnish.labelReceivedClientRequests'),
              t('in-forge:plugins.varnish.labelConnectionsDroppedFullQueue')
            ],
            formatter: zeroDecimalPlaces,
            tooltipFormatter: twoDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.varnish.titleCache')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['cache_hit', 'cache_miss', 'cache_hitpass'],
            labels: [
              t('in-forge:plugins.varnish.labelCacheHits'),
              t('in-forge:plugins.varnish.labelCacheMisses'),
              t('in-forge:plugins.varnish.labelHitsPassFile')
            ],
            type: 'line'
          }}
          y2={{
            min: 0,
            max: 1,
            metrics: ['cache_hit_rate'],
            labels: [t('in-forge:plugins.varnish.labelCacheHitRateLow')],
            type: 'line',
            formatter: hitRateZeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.varnish.titleCachedObjects')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['n_expired', 'n_lru_nuked'],
            labels: [
              t('in-forge:plugins.varnish.labelExpiredObjects'),
              t('in-forge:plugins.varnish.labelNukedObjects')
            ],
            type: 'line',
            formatter: zeroDecimalPlaces,
            tooltipFormatter: twoDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.varnish.titleThreads')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: [
              'threads',
              'threads_created',
              'threads_failed',
              'threads_limited',
              'thread_queue_len',
              'sess_queued'
            ],
            labels: [
              t('in-forge:plugins.varnish.titleThreads'),
              t('in-forge:plugins.varnish.labelCreated'),
              t('in-forge:plugins.varnish.labelFailed'),
              t('in-forge:plugins.varnish.labelLimited'),
              t('in-forge:plugins.varnish.labelQueue'),
              t('in-forge:plugins.varnish.labelQueuedRequests')
            ],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
          y2={{
            min: 0,
            metrics: ['threads'],
            labels: [t('in-forge:plugins.varnish.titleThreads')],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.varnish.titleBackend')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: [
              'backend_conn',
              'backend_recycle',
              'backend_reuse',
              'backend_fail',
              'backend_unhealthy',
              'backend_busy',
              'backend_req'
            ],
            labels: [
              t('in-forge:plugins.varnish.labelConnections'),
              t('in-forge:plugins.varnish.labelRecycled'),
              t('in-forge:plugins.varnish.labelReused'),
              t('in-forge:plugins.varnish.labelIdleClosed'),
              t('in-forge:plugins.varnish.labelUnhealthy'),
              t('in-forge:plugins.varnish.labelBusy'),
              t('in-forge:plugins.varnish.labelRequests')
            ],
            type: 'line',
            formatter: zeroDecimalPlaces,
            tooltipFormatter: twoDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      {hasMse ? (
        <DashboardSection title={t('in-forge:plugins.varnish.titleMassiveStorageEngine')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['mse_bytes'],
              labels: [t('in-forge:plugins.varnish.labelUsedBytes')],
              type: 'line',
              formatter: bytesZeroDecimalPlaces
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
          <MseTable snapshot={snapshot} timeConfig={timeConfig} />
        </DashboardSection>
      ) : null}
    </div>
  );
}
