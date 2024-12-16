/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import AzureServiceBusTopicsTable from 'in-forge/plugins/azureServiceBus/Dashboard/AzureServiceBusTopicsTable';
// @ts-expect-error Module needs to be translated to TS
import AzureServiceBusQueuesTable from 'in-forge/plugins/azureServiceBus/Dashboard/AzureServiceBusQueuesTable';
// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiKeyValue, KpiSection } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number, millis } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function AzureServiceBusDashboard({
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
        <KpiKeyValue label={t('in-forge:plugins.azureServiceBus.kpi.labelActiveConnections')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="activeConnections"
            formatter={number.compact}
            tooltipFormatter={number.compact}
          />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.azureServiceBus.kpi.labelServerErrors')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="serverErrors"
            formatter={number.compact}
            tooltipFormatter={number.compact}
          />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.azureServiceBus.kpi.labelServerSendLatency')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="serverSendLatency"
            formatter={millis.detailed}
            tooltipFormatter={millis.detailed}
          />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.azureServiceBus.dashboard.labelNamespaceConnections')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            metrics: ['activeConnections', 'connectionsOpened', 'connectionsClosed'],
            labels: [
              t('in-forge:plugins.azureServiceBus.dashboard.labelActiveConnections'),
              t('in-forge:plugins.azureServiceBus.dashboard.labelConnectionsOpened'),
              t('in-forge:plugins.azureServiceBus.dashboard.labelConnectionsClosed')
            ],
            type: 'line',
            min: 0
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.azureServiceBus.dashboard.labelNameSpaceServer')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['serverErrors'],
              labels: [t('in-forge:plugins.azureServiceBus.dashboard.labelServerErrors')],
              type: 'line',
              formatter: number.compact
            }}
            y2={{
              min: 0,
              metrics: ['serverSendLatency'],
              labels: [t('in-forge:plugins.azureServiceBus.dashboard.labelServerSendLatency')],
              type: 'line',
              formatter: millis.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.azureServiceBus.dashboard.labelNamespaceMessages')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['incomingMessages', 'outgoingMessages'],
              labels: [
                t('in-forge:plugins.azureServiceBus.dashboard.labelIncomingMessages'),
                t('in-forge:plugins.azureServiceBus.dashboard.labelOutgoingMessages')
              ],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <DashboardSection title={t('in-forge:plugins.azureServiceBus.dashboard.labelNameSpaceRequests')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            metrics: ['incomingRequests', 'successfulRequests', 'throttledRequests'],
            labels: [
              t('in-forge:plugins.azureServiceBus.dashboard.labelIncomingRequests'),
              t('in-forge:plugins.azureServiceBus.dashboard.labelSuccessfulRequests'),
              t('in-forge:plugins.azureServiceBus.dashboard.labelThrottledRequests')
            ],
            type: 'line',
            min: 0
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <AzureServiceBusQueuesTable snapshot={snapshot} timeConfig={timeConfig} />
      <AzureServiceBusTopicsTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
