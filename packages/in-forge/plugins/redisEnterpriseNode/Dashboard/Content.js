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
import { number, bytes, millis } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function RedisEnterpriseNodeDashboard({ snapshot, timeConfig }) {
  const data = snapshot.get('data');
  const sensorConnectionStatus = data.get('sensorConnectionStatus');
  if (sensorConnectionStatus !== 'OK') {
    return <DashboardNotification type="info">{sensorConnectionStatus}</DashboardNotification>;
  }

  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.redisEnterpriseNode.dashboard.requests')}>
          <MetricValue snapshotId={snapshotId} metric="total_req" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.redisEnterpriseNode.dashboard.latency')}>
          <MetricValue snapshotId={snapshotId} metric="avg_latency" formatter={millis.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.redisEnterpriseNode.dashboard.connections')}>
          <MetricValue snapshotId={snapshotId} metric="conns" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title={t('in-forge:plugins.redisEnterpriseNode.dashboard.requests')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['total_req'],
            labels: [t('in-forge:plugins.redisEnterpriseNode.dashboard.requestsOpsSec')],
            formatter: number.compact,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.redisEnterpriseNode.dashboard.latency')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['avg_latency'],
            labels: [t('in-forge:plugins.redisEnterpriseNode.dashboard.latency')],
            formatter: millis.detailed,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.redisEnterpriseNode.dashboard.connections')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['conns'],
            labels: [t('in-forge:plugins.redisEnterpriseNode.dashboard.count')],
            formatter: number.compact,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.redisEnterpriseNode.dashboard.cpu')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: number.detailed,
            metrics: ['cpu_user', 'cpu_system', 'cpu_idle'],
            labels: [
              t('in-forge:plugins.redisEnterpriseNode.dashboard.user'),
              t('in-forge:plugins.redisEnterpriseNode.dashboard.system'),
              t('in-forge:plugins.redisEnterpriseNode.dashboard.idle')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.redisEnterpriseNode.dashboard.memory')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: bytes.detailed,
            metrics: ['free_memory', 'available_memory', 'provisional_memory'],
            labels: [
              t('in-forge:plugins.redisEnterpriseNode.dashboard.free'),
              t('in-forge:plugins.redisEnterpriseNode.dashboard.available'),
              t('in-forge:plugins.redisEnterpriseNode.dashboard.provisional')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.redisEnterpriseNode.dashboard.network')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: bytes.perSecond,
            metrics: ['ingress_bytes', 'egress_bytes'],
            labels: [
              t('in-forge:plugins.redisEnterpriseNode.dashboard.ingress'),
              t('in-forge:plugins.redisEnterpriseNode.dashboard.egress')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
