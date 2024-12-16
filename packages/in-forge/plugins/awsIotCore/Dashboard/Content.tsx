/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiKeyValue, KpiSection } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
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
        <KpiKeyValue label={t('in-forge:plugins.awsIotCore.labelConnectSuccess')}>
          <MetricValue snapshotId={snapshotId} metric="connect_success" formatter={zeroDecimalPlaces} />
        </KpiKeyValue>

        <KpiKeyValue label={t('in-forge:plugins.awsIotCore.labelRulesExecuted')}>
          <MetricValue snapshotId={snapshotId} metric="rules_executed" formatter={zeroDecimalPlaces} />
        </KpiKeyValue>
      </KpiSection>

      {/* Connections */}
      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsIotCore.dashboard.titleConnections')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: [
                'connect_success',
                'connect_account_throttle',
                'connect_client_id_throttle',
                'connect_throttle_total'
              ],
              labels: [
                t('in-forge:plugins.awsIotCore.labelConnectSuccess'),
                t('in-forge:plugins.awsIotCore.labelConnectAccountThrottle'),
                t('in-forge:plugins.awsIotCore.labelConnectClientIdThrottle'),
                t('in-forge:plugins.awsIotCore.labelConnectThrottleTotal')
              ],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      {/* Rules and Pings */}
      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsIotCore.dashboard.titleRules')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['rules_executed'],
              labels: [t('in-forge:plugins.awsIotCore.labelRulesExecuted')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>

        <DashboardSection title={t('in-forge:plugins.awsIotCore.dashboard.titlePings')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['ping_success'],
              labels: [t('in-forge:plugins.awsIotCore.labelPingSuccess')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      {/* Connection Errors */}
      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsIotCore.dashboard.titleConnectionErrors')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['connect_auth_error', 'connect_client_error', 'connect_server_error'],
              labels: [
                t('in-forge:plugins.awsIotCore.labelConnectAuthError'),
                t('in-forge:plugins.awsIotCore.labelConnectClientError'),
                t('in-forge:plugins.awsIotCore.labelConnectServerError')
              ],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      {/* Publish In Errors */}
      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsIotCore.dashboard.titlePublishInErrors')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['publish_in_auth_error', 'publish_in_client_error', 'publish_in_server_error'],
              labels: [
                t('in-forge:plugins.awsIotCore.labelPublishInAuthError'),
                t('in-forge:plugins.awsIotCore.labelPublishInClientError'),
                t('in-forge:plugins.awsIotCore.labelPublishInServerError')
              ],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      {/* Publish In Requests and Publish Out Errors */}
      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsIotCore.dashboard.titlePublishInRequests')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['publish_in_success', 'publish_in_throttle'],
              labels: [
                t('in-forge:plugins.awsIotCore.labelPublishInSuccess'),
                t('in-forge:plugins.awsIotCore.labelPublishInThrottle')
              ],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>

        <DashboardSection title={t('in-forge:plugins.awsIotCore.dashboard.titlePublishOutErrors')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['publish_out_auth_error', 'publish_out_client_error'],
              labels: [
                t('in-forge:plugins.awsIotCore.labelPublishOutAuthError'),
                t('in-forge:plugins.awsIotCore.labelPublishOutClientError')
              ],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      {/* Publish Out and Subscription Requests */}
      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsIotCore.dashboard.titlePublishOutRequests')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['publish_out_success', 'publish_out_throttle'],
              labels: [
                t('in-forge:plugins.awsIotCore.labelPublishOutSuccess'),
                t('in-forge:plugins.awsIotCore.labelPublishOutThrottle')
              ],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>

        <DashboardSection title={t('in-forge:plugins.awsIotCore.dashboard.titleSubscriptions')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['subscribe_success', 'subscribe_throttle'],
              labels: [
                t('in-forge:plugins.awsIotCore.labelSubscribeSuccess'),
                t('in-forge:plugins.awsIotCore.labelSubscribeThrottle')
              ],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      {/* Publish In Errors */}
      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsIotCore.dashboard.titleDeviceShadowRequests')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: [
                'get_thing_shadow_accepted',
                'update_thing_shadow_accepted',
                'delete_thing_shadow_accepted',
                'list_thing_shadow_accepted'
              ],
              labels: [
                t('in-forge:plugins.awsIotCore.labelGetThingShadowAccepted'),
                t('in-forge:plugins.awsIotCore.labelUpdateThingShadowAccepted'),
                t('in-forge:plugins.awsIotCore.labelDeleteThingShadowAccepted'),
                t('in-forge:plugins.awsIotCore.labelListThingShadowAccepted')
              ],
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
