/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { bytes, number, hitRateZeroDecimalPlaces } from 'in-services/formatters/number';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function MemcachedDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const maxBytes = snapshot.getIn(['data', 'limit_maxbytes']);
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus']);
  if (sensorConnectionStatus !== 'OK') {
    return <DashboardNotification type="info">{sensorConnectionStatus}</DashboardNotification>;
  }

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.memcached.gets')}>
          <MetricValue snapshotId={snapshotId} metric="cmd_get" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.memcached.sets')}>
          <MetricValue snapshotId={snapshotId} metric="cmd_set" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.memcached.getHitRatio')}>
          <MetricValue snapshotId={snapshotId} metric="get_hit_rate" formatter={hitRateZeroDecimalPlaces} />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title={t('in-forge:plugins.memcached.commands')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['cmd_get', 'cmd_set'],
            labels: [t('in-forge:plugins.memcached.gets'), t('in-forge:plugins.memcached.sets')],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.memcached.readsWrites')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['bytes_read', 'bytes_write'],
            labels: [t('in-forge:plugins.memcached.reads'), t('in-forge:plugins.memcached.writes')],
            type: 'line',
            formatter: bytes.detailed
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.memcached.getHitsMisses')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['get_hits', 'get_misses'],
            labels: [t('in-forge:plugins.memcached.getHits'), t('in-forge:plugins.memcached.getMisses')],
            type: 'line',
            formatter: number.compact
          }}
          y2={{
            min: 0,
            max: 1,
            metrics: ['get_hit_rate'],
            labels: [t('in-forge:plugins.memcached.getHitRatio')],
            type: 'line',
            formatter: hitRateZeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.memcached.deleteHitsMisses')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['delete_hits', 'delete_misses'],
            labels: [t('in-forge:plugins.memcached.deleteHits'), t('in-forge:plugins.memcached.deleteMisses')],
            type: 'line',
            formatter: number.compact
          }}
          y2={{
            min: 0,
            max: 1,
            metrics: ['delete_hit_rate'],
            labels: [t('in-forge:plugins.memcached.deleteHitRatio')],
            type: 'line',
            formatter: hitRateZeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.memcached.flushCommand')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['cmd_flush'],
            labels: [t('in-forge:plugins.memcached.flush')],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.memcached.evictions')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['evictions'],
            labels: [t('in-forge:plugins.memcached.evictions')],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.memcached.usedBytes')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            max: maxBytes,
            metrics: ['bytes'],
            labels: [t('in-forge:plugins.memcached.usedBytes')],
            type: 'line',
            formatter: bytes.detailed
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.memcached.connections')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['conn_connected', 'conn_queued', 'conn_yields'],
            labels: [
              t('in-forge:plugins.memcached.connected'),
              t('in-forge:plugins.memcached.queued'),
              t('in-forge:plugins.memcached.yields')
            ],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
