/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import {
  bytesTwoDecimalPlaces,
  zeroDecimalPlaces,
  percentagePlainTwoDecimalPlaces,
  millis
} from 'in-services/formatters/number';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import MetricValue from 'in-components/MetricValue';
import OperationsTable from './OperationsTable.js';
import ApisTable from './ApisTable.js';

export default function AzureApiManagementDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.azureApiManagement.dashboard.labelCapacity')}>
          <MetricValue snapshotId={snapshotId} metric="metrics.Capacity" formatter={percentagePlainTwoDecimalPlaces} />
        </KpiKeyValue>

        <KpiKeyValue label={t('in-forge:plugins.azureApiManagement.dashboard.labelLatency')}>
          <MetricValue snapshotId={snapshotId} metric="metrics.Duration" formatter={millis.detailed} />
        </KpiKeyValue>
      </KpiSection>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.azureApiManagement.dashboard.labelCapacity')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['metrics.Capacity'],
              labels: [t('in-forge:plugins.azureApiManagement.dashboard.labelCapacity')],
              formatter: percentagePlainTwoDecimalPlaces,
              type: 'area',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>

        <DashboardSection title={t('in-forge:plugins.azureApiManagement.dashboard.labelLatency')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['metrics.Duration'],
              labels: [t('in-forge:plugins.azureApiManagement.dashboard.labelOverallDuration')],
              formatter: millis.detailed,
              type: 'area',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <DashboardSection title={t('in-forge:plugins.azureApiManagement.dashboard.titleGatewayRequests')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: [
              'metrics.TotalRequests',
              'metrics.SuccessfulRequests',
              'metrics.UnauthorizedRequests',
              'metrics.FailedRequests',
              'metrics.OtherRequests'
            ],
            labels: [
              t('in-forge:plugins.azureApiManagement.dashboard.labelTotalRequests'),
              t('in-forge:plugins.azureApiManagement.dashboard.labelSuccessfulRequests'),
              t('in-forge:plugins.azureApiManagement.dashboard.labelUnauthorizedRequests'),
              t('in-forge:plugins.azureApiManagement.dashboard.labelFailedRequests'),
              t('in-forge:plugins.azureApiManagement.dashboard.labelOtherRequests')
            ],
            formatter: zeroDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureApiManagement.dashboard.titleEventHubEvents')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: [
              'metrics.EventHubTotalEvents',
              'metrics.EventHubSuccessfulEvents',
              'metrics.EventHubTotalFailedEvents',
              'metrics.EventHubRejectedEvents',
              'metrics.EventHubThrottledEvents',
              'metrics.EventHubTimedoutEvents',
              'metrics.EventHubDroppedEvents'
            ],
            labels: [
              t('in-forge:plugins.azureApiManagement.dashboard.labelTotalEvents'),
              t('in-forge:plugins.azureApiManagement.dashboard.labelSuccessfulEvents'),
              t('in-forge:plugins.azureApiManagement.dashboard.labelFailedEvents'),
              t('in-forge:plugins.azureApiManagement.dashboard.labelRejectedEvents'),
              t('in-forge:plugins.azureApiManagement.dashboard.labelThrottledEvents'),
              t('in-forge:plugins.azureApiManagement.dashboard.labelTimedOutEvents'),
              t('in-forge:plugins.azureApiManagement.dashboard.labelDroppedEvents')
            ],
            formatter: zeroDecimalPlaces,
            type: 'line'
          }}
          y2={{
            min: 0,
            metrics: ['metrics.EventHubTotalBytesSent'],
            labels: [t('in-forge:plugins.azureApiManagement.dashboard.labelSizeOfEventHubEvents')],
            formatter: bytesTwoDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <ApisTable snapshot={snapshot} timeConfig={timeConfig} />
      <OperationsTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
