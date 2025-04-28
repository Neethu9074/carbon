/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { percentagePlainTwoDecimalPlaces, bytesTwoDecimalPlaces, number, millis } from 'in-services/formatters/number';
import AzureEventHubsTable from 'in-forge/plugins/azureEventHubNamespace/Dashboard/AzureEventHubsTable';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiKeyValue, KpiSection } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function AzureEventHubNamespaceDashboard({
  snapshot,
  timeConfig
}: {
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.azureEventHubNamespace.kpi.labelNamespaceCpuUsages')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="namespaceCpuUsage"
            formatter={percentagePlainTwoDecimalPlaces}
            tooltipFormatter={percentagePlainTwoDecimalPlaces}
          />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.azureEventHubNamespace.kpi.labelConnectionsActive')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="activeConnections"
            formatter={number.compact}
            tooltipFormatter={number.compact}
          />
        </KpiKeyValue>
      </KpiSection>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.azureEventHubNamespace.dashboard.titleConnections')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['activeConnections', 'connectionsOpened', 'connectionsClosed'],
              labels: [
                t('in-forge:plugins.azureEventHubNamespace.dashboard.labelActiveConnections'),
                t('in-forge:plugins.azureEventHubNamespace.dashboard.labelConnectionsOpened'),
                t('in-forge:plugins.azureEventHubNamespace.dashboard.labelConnectionsClosed')
              ],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.azureEventHubNamespace.dashboard.titleUsage')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: percentagePlainTwoDecimalPlaces,
              metrics: ['namespaceCpuUsage', 'namespaceMemoryUsage'],
              labels: [
                t('in-forge:plugins.azureEventHubNamespace.dashboard.labelNamespaceCpuUsages'),
                t('in-forge:plugins.azureEventHubNamespace.dashboard.labelNamespaceMemoryUsage')
              ],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.azureEventHubNamespace.dashboard.titleTraffic')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: bytesTwoDecimalPlaces,
              metrics: ['incomingBytes', 'outgoingBytes'],
              labels: [
                t('in-forge:plugins.azureEventHubNamespace.dashboard.labelIncomingBytes'),
                t('in-forge:plugins.azureEventHubNamespace.dashboard.labelOutgoingBytes')
              ],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.azureEventHubNamespace.dashboard.titleMessages')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['incomingMessages', 'outgoingMessages'],
              labels: [
                t('in-forge:plugins.azureEventHubNamespace.dashboard.labelIncomingMessages'),
                t('in-forge:plugins.azureEventHubNamespace.dashboard.labelOutgoingMessages')
              ],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.azureEventHubNamespace.dashboard.titleRequests')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['throttledRequests', 'incomingRequests', 'successfulRequests'],
              labels: [
                t('in-forge:plugins.azureEventHubNamespace.dashboard.labelThrottledRequests'),
                t('in-forge:plugins.azureEventHubNamespace.dashboard.labelIncomingRequests'),
                t('in-forge:plugins.azureEventHubNamespace.dashboard.labelSuccessfulRequests')
              ],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.azureEventHubNamespace.dashboard.titleReplicationLag')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['replicationLagCount'],
              labels: [t('in-forge:plugins.azureEventHubNamespace.dashboard.labelReplicationLagCount')],
              type: 'line',
              min: 0
            }}
            y2={{
              min: 0,
              metrics: ['replicationLagDuration'],
              labels: [t('in-forge:plugins.azureEventHubNamespace.dashboard.labelReplicationLagDuration')],
              type: 'line',
              formatter: millis.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.azureEventHubNamespace.dashboard.titleErrors')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['serverErrors', 'userErrors'],
              labels: [
                t('in-forge:plugins.azureEventHubNamespace.dashboard.labelServerErrors'),
                t('in-forge:plugins.azureEventHubNamespace.dashboard.labelUserErrors')
              ],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <AzureEventHubsTable snapshot={snapshot} />
    </div>
  );
}
