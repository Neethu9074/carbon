/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { zeroDecimalPlaces, bytesZeroDecimalPlaces, millis } from 'in-services/formatters/number';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiKeyValue, KpiSection } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function AwsAppSyncDashboard({
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
        <KpiKeyValue label={t('in-forge:plugins.awsAppSync.labelTotalErrors')}>
          <MetricValue snapshotId={snapshotId} metric="total_errors" formatter={zeroDecimalPlaces} />
        </KpiKeyValue>

        <KpiKeyValue label={t('in-forge:plugins.awsAppSync.labelLatency')}>
          <MetricValue snapshotId={snapshotId} metric="latency" formatter={millis.detailed} />
        </KpiKeyValue>

        <KpiKeyValue label={t('in-forge:plugins.awsAppSync.labelRequests')}>
          <MetricValue snapshotId={snapshotId} metric="requests" formatter={zeroDecimalPlaces} />
        </KpiKeyValue>
      </KpiSection>

      {/* Errors */}
      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsAppSync.dashboard.titleErrors')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['4xx_error', '5xx_error'],
              labels: [t('in-forge:plugins.awsAppSync.label4xxError'), t('in-forge:plugins.awsAppSync.label5xxError')],
              type: 'line',
              min: 0
            }}
            y2={{
              formatter: zeroDecimalPlaces,
              metrics: ['total_errors'],
              labels: [t('in-forge:plugins.awsAppSync.labelTotalErrors')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      {/* Latency and Requests */}
      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsAppSync.dashboard.titleLatency')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: millis.detailed,
              metrics: ['latency'],
              labels: [t('in-forge:plugins.awsAppSync.labelLatency')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.awsAppSync.dashboard.titleRequests')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['requests'],
              labels: [t('in-forge:plugins.awsAppSync.labelRequests')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      {/* Active Connections and Subscriptions */}
      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsAppSync.dashboard.titleActiveConnections')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['active_connections'],
              labels: [t('in-forge:plugins.awsAppSync.labelActiveConnections')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.awsAppSync.dashboard.titleActiveSubscriptions')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['active_subscriptions'],
              labels: [t('in-forge:plugins.awsAppSync.labelActiveSubscriptions')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.awsAppSync.dashboard.titleConnectionDuration')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: millis.detailed,
              metrics: ['connection_duration'],
              labels: [t('in-forge:plugins.awsAppSync.labelConnectionDuration')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      {/* Connections */}
      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsAppSync.dashboard.titleConnections')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['connect_success', 'connect_client_error', 'connect_server_error'],
              labels: [
                t('in-forge:plugins.awsAppSync.labelConnectSuccess'),
                t('in-forge:plugins.awsAppSync.labelConnectClientError'),
                t('in-forge:plugins.awsAppSync.labelConnectServerError')
              ],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      {/* Subscriptions */}
      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsAppSync.dashboard.titleSubscriptions')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['subscribe_success', 'subscribe_client_error', 'subscribe_server_error'],
              labels: [
                t('in-forge:plugins.awsAppSync.labelSubscribeSuccess'),
                t('in-forge:plugins.awsAppSync.labelSubscribeClientError'),
                t('in-forge:plugins.awsAppSync.labelSubscribeServerError')
              ],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      {/* Published Data Messages */}
      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsAppSync.dashboard.titlePublishedDataMessages')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: [
                'publish_data_message_success',
                'publish_data_message_client_error',
                'publish_data_message_server_error'
              ],
              labels: [
                t('in-forge:plugins.awsAppSync.labelPublishDataMessageSuccess'),
                t('in-forge:plugins.awsAppSync.labelPublishDataMessageClientError'),
                t('in-forge:plugins.awsAppSync.labelPublishDataMessageServerError')
              ],
              type: 'line',
              min: 0
            }}
            y2={{
              formatter: bytesZeroDecimalPlaces,
              metrics: ['publish_data_message_size'],
              labels: [t('in-forge:plugins.awsAppSync.labelPublishDataMessageSize')],
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
