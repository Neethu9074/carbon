/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import AzureEventHubNamespaceTable from 'in-forge/plugins/azureEventHubCluster/Dashboard/AzureEventHubNamespaceTable';
// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { percentagePlainTwoDecimalPlaces, bytesTwoDecimalPlaces, number } from 'in-services/formatters/number';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiKeyValue, KpiSection } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function AzureEventHubClusterDashboard({
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
        <KpiKeyValue label={t('in-forge:plugins.azureEventHubCluster.kpi.labelCPU')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="cpu"
            formatter={percentagePlainTwoDecimalPlaces}
            tooltipFormatter={percentagePlainTwoDecimalPlaces}
          />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.azureEventHubCluster.kpi.labelConnectionsActive')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="activeConnections"
            formatter={number.compact}
            tooltipFormatter={number.compact}
          />
        </KpiKeyValue>
      </KpiSection>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.azureEventHubCluster.dashboard.titleConnections')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['activeConnections', 'connectionsOpened', 'connectionsClosed'],
              labels: [
                t('in-forge:plugins.azureEventHubCluster.dashboard.labelActiveConnections'),
                t('in-forge:plugins.azureEventHubCluster.dashboard.labelConnectionsOpened'),
                t('in-forge:plugins.azureEventHubCluster.dashboard.labelConnectionsClosed')
              ],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.azureEventHubCluster.dashboard.titleTraffic')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: bytesTwoDecimalPlaces,
              metrics: ['incomingBytes', 'outgoingBytes'],
              labels: [
                t('in-forge:plugins.azureEventHubCluster.dashboard.labelIncomingBytes'),
                t('in-forge:plugins.azureEventHubCluster.dashboard.labelOutgoingBytes')
              ],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.azureEventHubCluster.dashboard.titleMessages')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['incomingMessages', 'outgoingMessages'],
              labels: [
                t('in-forge:plugins.azureEventHubCluster.dashboard.labelIncomingMessages'),
                t('in-forge:plugins.azureEventHubCluster.dashboard.labelOutgoingMessages')
              ],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.azureEventHubCluster.dashboard.titleRequests')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['throttledRequests', 'incomingRequests', 'successfulRequests'],
              labels: [
                t('in-forge:plugins.azureEventHubCluster.dashboard.labelThrottledRequests'),
                t('in-forge:plugins.azureEventHubCluster.dashboard.labelIncomingRequests'),
                t('in-forge:plugins.azureEventHubCluster.dashboard.labelSuccessfulRequests')
              ],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.azureEventHubCluster.dashboard.titleErrors')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['serverErrors', 'userErrors'],
              labels: [
                t('in-forge:plugins.azureEventHubCluster.dashboard.labelServerErrors'),
                t('in-forge:plugins.azureEventHubCluster.dashboard.labelUserErrors')
              ],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <AzureEventHubNamespaceTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
