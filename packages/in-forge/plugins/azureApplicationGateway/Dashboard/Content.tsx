/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { bytes, number, meanLatency, percentagePlainTwoDecimalPlaces } from 'in-services/formatters/number';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiKeyValue, KpiSection } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function AzureApplicationGatewayDashboard({
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
        <KpiKeyValue label={t('in-forge:plugins.azureApplicationGateway.kpi.labelConnectionsCount')}>
          <MetricValue snapshotId={snapshotId} metric="currentConnections" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.azureApplicationGateway.kpi.labelApplicationGatewayTime')}>
          <MetricValue snapshotId={snapshotId} metric="applicationGatewayTotalTime" formatter={meanLatency.compact} />
        </KpiKeyValue>
      </KpiSection>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.azureApplicationGateway.dashboard.labelTitleConnections')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['currentConnections'],
              labels: [t('in-forge:plugins.azureApplicationGateway.dashboard.labelCount')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection
          title={t('in-forge:plugins.azureApplicationGateway.dashboard.labelTitleApplicationGatewayTime')}
        >
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: meanLatency.compact,
              metrics: ['applicationGatewayTotalTime'],
              labels: [t('in-forge:plugins.azureApplicationGateway.dashboard.labelApplicationGatewayTotalTime')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.azureApplicationGateway.dashboard.labelTitleThroughput')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: bytes.compact,
              metrics: ['throughput'],
              labels: [t('in-forge:plugins.azureApplicationGateway.dashboard.labelThroughput')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.azureApplicationGateway.dashboard.labelTitleRequests')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['totalRequests', 'failedRequests'],
              labels: [
                t('in-forge:plugins.azureApplicationGateway.dashboard.labelTotalRequests'),
                t('in-forge:plugins.azureApplicationGateway.dashboard.labelFailedRequests')
              ],
              type: 'line',
              min: 0
            }}
            y2={{
              formatter: percentagePlainTwoDecimalPlaces,
              metrics: ['requestsFailedPercentage'],
              labels: [t('in-forge:plugins.azureApplicationGateway.dashboard.labelrequestsFailedPercentage')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.azureApplicationGateway.dashboard.labelTitleHostCount')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['healthyHostCount', 'unhealthyHostCount'],
              labels: [
                t('in-forge:plugins.azureApplicationGateway.dashboard.labelHealthy'),
                t('in-forge:plugins.azureApplicationGateway.dashboard.labelUnhealthy')
              ],
              type: 'line',
              min: 0
            }}
            y2={{
              formatter: percentagePlainTwoDecimalPlaces,
              metrics: ['hostCountUnhealthyPercentage'],
              labels: [t('in-forge:plugins.azureApplicationGateway.dashboard.labelHostCountUnhealthyPercentage')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.azureApplicationGateway.dashboard.labelTitleComputeUnits')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['computeUnits'],
              labels: [t('in-forge:plugins.azureApplicationGateway.dashboard.labelComputeUnits')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.azureApplicationGateway.dashboard.labelTitleBytes')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: bytes.compact,
              metrics: ['bytesSent', 'bytesReceived'],
              labels: [
                t('in-forge:plugins.azureApplicationGateway.dashboard.labelSent'),
                t('in-forge:plugins.azureApplicationGateway.dashboard.labelReceived')
              ],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
    </div>
  );
}
