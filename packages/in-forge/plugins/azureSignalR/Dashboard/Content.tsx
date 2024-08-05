/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

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

export default function AzureSignalRDashboard({
  snapshot,
  timeConfig
}: {
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}) {
  const snapshotId = snapshot.get('id');

  return (
    <>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.azureSignalR.kpi.labelConnectionsOpen')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="connectionOpenCount"
            formatter={number.compact}
            tooltipFormatter={number.compact}
          />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.azureSignalR.dashboard.titleConnections')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            metrics: ['connectionCount', 'connectionOpenCount'],
            labels: [
              t('in-forge:plugins.azureSignalR.dashboard.labelTotal'),
              t('in-forge:plugins.azureSignalR.dashboard.lableOpen')
            ],
            type: 'line',
            min: 0
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.azureSignalR.dashboard.titleErrors')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: percentagePlainTwoDecimalPlaces,
              metrics: ['userErrors', 'systemErrors'],
              labels: [
                t('in-forge:plugins.azureSignalR.dashboard.lableUser'),
                t('in-forge:plugins.azureSignalR.dashboard.lableSystem')
              ],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.azureSignalR.dashboard.titleTraffic')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: bytesTwoDecimalPlaces,
              metrics: ['inboundTraffic', 'outboundTraffic'],
              labels: [
                t('in-forge:plugins.azureSignalR.dashboard.lableInbound'),
                t('in-forge:plugins.azureSignalR.dashboard.lableOutbound')
              ],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.azureSignalR.dashboard.titleConnectionQuota')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: percentagePlainTwoDecimalPlaces,
              metrics: ['connectionQuotaUtilization'],
              labels: [t('in-forge:plugins.azureSignalR.dashboard.labelUtilization')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.azureSignalR.dashboard.titleMessage')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['messageCount'],
              labels: [t('in-forge:plugins.azureSignalR.dashboard.labelCount')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.azureSignalR.dashboard.titleServer')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: percentagePlainTwoDecimalPlaces,
              metrics: ['serverLoad'],
              labels: [t('in-forge:plugins.azureSignalR.dashboard.labelLoad')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
    </>
  );
}
