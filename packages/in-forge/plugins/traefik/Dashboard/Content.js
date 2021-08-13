/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { formatTime } from 'in-services/formatters/date';
import { emptyList } from 'in-services/fixedImmutables';
import { number } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import theme from 'in-themes';
import { t } from 'in-i18n';

export default function TraefikDashboard({ snapshot, timeConfig }) {
  const prometheusEnabled = snapshot.getIn(['data', 'prometheus_enabled']);
  if (!prometheusEnabled) {
    return null;
  }

  const snapshotId = snapshot.get('id');

  const backends = snapshot
    .getIn(['data', 'http_entry_points_list'], emptyList)
    .toArray()
    .map(key => {
      return {
        key: key,
        snapshotId,
        timeConfig
      };
    });

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.traefik.dashboard.configLastReloadSuccess')}>
          <MetricValue snapshotId={snapshotId} metric="config_last_reload_success" formatter={formatTime} />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title={t('in-forge:plugins.traefik.dashboard.configReloadsTotal')}>
        <MetricValue snapshotId={snapshotId} metric="config_reloads_total" formatter={number.compact} />
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['config_reloads_total'],
            labels: [t('in-forge:plugins.traefik.dashboard.configReloadsTotal')],
            colors: [theme.lib.colors.lightBlue800, theme.lib.colors.red800],
            type: 'stackedBar',
            aggregation: 'sum',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.traefik.dashboard.requestsPerSecond')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['http.1xx', 'http.2xx', 'http.3xx', 'http.4xx', 'http.5xx'],
            labels: [
              t('in-forge:plugins.labelRequests.1xx'),
              t('in-forge:plugins.labelRequests.2xx'),
              t('in-forge:plugins.labelRequests.3xx'),
              t('in-forge:plugins.labelRequests.4xx'),
              t('in-forge:plugins.labelRequests.5xx')
            ],
            colors: [
              theme.lib.colors.lightBlue800,
              theme.lib.colors.green800,
              theme.lib.colors.yellow800,
              theme.lib.colors.orange800,
              theme.lib.colors.red800
            ],
            type: 'stackedBar',
            aggregation: 'sum',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.traefik.dashboard.entryPoints')}>
        {backends.map(d => (
          <DashboardSection
            key={d.key}
            title={d.key + ': ' + t('in-forge:plugins.traefik.dashboard.requestsPerSecond')}
          >
            <Chart
              key={d.key}
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                metrics: [
                  'http_entry_points.' + d.key + '.1xx',
                  'http_entry_points.' + d.key + '.2xx',
                  'http_entry_points.' + d.key + '.3xx',
                  'http_entry_points.' + d.key + '.4xx',
                  'http_entry_points.' + d.key + '.5xx'
                ],
                labels: [
                  t('in-forge:plugins.labelRequests.1xx'),
                  t('in-forge:plugins.labelRequests.2xx'),
                  t('in-forge:plugins.labelRequests.3xx'),
                  t('in-forge:plugins.labelRequests.4xx'),
                  t('in-forge:plugins.labelRequests.5xx')
                ],
                colors: [
                  theme.lib.colors.lightBlue800,
                  theme.lib.colors.green800,
                  theme.lib.colors.yellow800,
                  theme.lib.colors.orange800,
                  theme.lib.colors.red800
                ],
                type: 'stackedBar',
                aggregation: 'sum',
                formatter: number.compact
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        ))}
      </DashboardSection>
    </div>
  );
}
