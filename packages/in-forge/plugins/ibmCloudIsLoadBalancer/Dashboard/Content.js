/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { number, bytesPerSecondZeroDecimalPlaces } from 'in-services/formatters/number';
import { KpiKeyValue, KpiSection } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function ibmCloudIsLoadBalancerDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.ibmCloudIsLoadBalancer.labelActiveConnections')}>
          <MetricValue snapshotId={snapshotId} metric="active_connection" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.ibmCloudIsLoadBalancer.labelConnectionRate')}>
          <MetricValue snapshotId={snapshotId} metric="connection_rate" formatter={number.perSecond.detailed} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.ibmCloudIsLoadBalancer.labelThroughput')}>
          <MetricValue snapshotId={snapshotId} metric="throughput" formatter={bytesPerSecondZeroDecimalPlaces} />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title={t('in-forge:plugins.ibmCloudIsLoadBalancer.labelActiveConnections')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: number.compact,
            metrics: ['active_connection'],
            labels: [t('in-forge:plugins.ibmCloudIsLoadBalancer.labelActiveConnections')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.ibmCloudIsLoadBalancer.labelThroughput')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: bytesPerSecondZeroDecimalPlaces,
            metrics: ['throughput'],
            labels: [t('in-forge:plugins.ibmCloudIsLoadBalancer.labelThroughput')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.ibmCloudIsLoadBalancer.labelConnectionRate')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: number.compact,
            metrics: ['connection_rate'],
            labels: [t('in-forge:plugins.ibmCloudIsLoadBalancer.labelConnectionRate')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
