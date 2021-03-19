/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { number, bytesPerSecondZeroDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import { KpiKeyValue, KpiSection } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function iBMCloudBalancerDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.iBMCloudLoadBalancer.labelActiveConnections')}>
          <MetricValue snapshotId={snapshotId} metric="active_connection" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.iBMCloudLoadBalancer.labelConnectionRate')}>
          <MetricValue snapshotId={snapshotId} metric="connection_rate" formatter={number.perSecond.detailed} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.iBMCloudLoadBalancer.labelThroughput')}>
          <MetricValue snapshotId={snapshotId} metric="throughput" formatter={bytesPerSecondZeroDecimalPlaces} />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title={t('in-forge:plugins.iBMCloudLoadBalancer.labelActiveConnections')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: zeroDecimalPlaces,
            metrics: ['active_connection'],
            labels: [t('in-forge:plugins.iBMCloudLoadBalancer.labelActiveConnections')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.iBMCloudLoadBalancer.labelThroughput')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: bytesPerSecondZeroDecimalPlaces,
            metrics: ['throughput'],
            labels: [t('in-forge:plugins.iBMCloudLoadBalancer.labelThroughput')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
