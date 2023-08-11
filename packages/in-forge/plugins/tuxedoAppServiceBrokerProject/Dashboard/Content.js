/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import ServiceBrokerTable from 'in-forge/plugins/tuxedoAppServiceBrokerProject/Dashboard/ServiceBrokerTable';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { number, millis, twoDecimalPlaces } from 'in-services/formatters/number';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
//@ts-expect-error
import Columize from 'in-sdk/components/dashboard/Columize';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function ServiceBrokerProjectDashboard({ snapshot, timeConfig }) {
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');
  if (sensorConnectionStatus !== 'OK') {
    return <DashboardNotification type="info">{sensorConnectionStatus}</DashboardNotification>;
  }
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.tuxedoAppServiceBrokerProject.avgResTime')}>
          <MetricValue snapshotId={snapshotId} metric="avgResTime" formatter={millis.detailed} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.tuxedoAppServiceBrokerProject.throughput')}>
          <MetricValue snapshotId={snapshotId} metric="throughput" formatter={number.detailed} />
        </KpiKeyValue>
      </KpiSection>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.tuxedoAppServiceBrokerProject.avgResTime')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['avgResTime'],
              labels: [t('in-forge:plugins.tuxedoAppServiceBrokerProject.avgResTime')],
              type: 'line',
              formatter: millis.detailed
            }}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.tuxedoAppServiceBrokerProject.throughput')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['throughput'],
              labels: [t('in-forge:plugins.tuxedoAppServiceBrokerProject.throughputOpsSec')],
              type: 'line',
              formatter: twoDecimalPlaces
            }}
          />
        </DashboardSection>
      </Columize>
      <DashboardSection title={t('in-forge:plugins.tuxedoAppServiceBrokerProject.timeBreakdown')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['preCallTime', 'callTime', 'postCallTime'],
            labels: [
              t('in-forge:plugins.tuxedoAppServiceBrokerProject.preCallTime'),
              t('in-forge:plugins.tuxedoAppServiceBrokerProject.callTime'),
              t('in-forge:plugins.tuxedoAppServiceBrokerProject.postCallTime')
            ],
            type: 'line',
            formatter: millis.detailed
          }}
        />
      </DashboardSection>
      <ServiceBrokerTable snapshot={snapshot} timeConfig={timeConfig} snapshotId={snapshotId} />
    </div>
  );
}
