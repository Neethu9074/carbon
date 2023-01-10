/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number, millis } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import { t } from 'in-i18n';

export default function AwsApiGatewayHttpDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <DashboardSection title={t('in-forge:plugins.awsApiGateway.titleApiRequests')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['api_requests_count'],
            labels: [t('in-forge:plugins.awsApiGateway.labelCount')],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.awsApiGateway.titleLatency')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['integration_latency', 'latency_total'],
            labels: [
              t('in-forge:plugins.awsApiGateway.labelIntegrationLatency'),
              t('in-forge:plugins.awsApiGateway.labelLatencyTotal')
            ],
            type: 'line',
            formatter: millis.detailed
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsApiGateway.title4xxErrors')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              max: 1,
              metrics: ['4xx_avg'],
              labels: [t('in-forge:plugins.awsApiGateway.labelAverage')],
              type: 'line',
              formatter: number.detailed
            }}
            y2={{
              min: 0,
              metrics: ['4xx_sum'],
              labels: [t('in-forge:plugins.awsApiGateway.labelSum')],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.awsApiGateway.title5xxErrors')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              max: 1,
              metrics: ['5xx_avg'],
              labels: [t('in-forge:plugins.awsApiGateway.labelAverage')],
              type: 'line',
              formatter: number.detailed
            }}
            y2={{
              min: 0,
              metrics: ['5xx_sum'],
              labels: [t('in-forge:plugins.awsApiGateway.labelSum')],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
    </div>
  );
}
