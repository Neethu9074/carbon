/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import ServiceBrokerProjectTable from 'in-forge/plugins/tuxedoAppApplication/Dashboard/ServiceBrokerProjectTable';
import TuxedoServiceTable from 'in-forge/plugins/tuxedoAppApplication/Dashboard/TuxedoServiceTable';
import { number, zeroDecimalPlaces, twoDecimalPlaces } from 'in-services/formatters/number';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
//@ts-expect-error
import Columize from 'in-sdk/components/dashboard/Columize';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function ApplicationDashboard({ snapshot, timeConfig }) {
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');
  if (sensorConnectionStatus !== 'OK') {
    return <DashboardNotification type="info">{sensorConnectionStatus}</DashboardNotification>;
  }
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.tuxedoAppApplication.numOfSBrokerProjects')}>
          <MetricValue snapshotId={snapshotId} metric="numOfSBrokerProjects" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.tuxedoAppApplication.numOfTuxSvcs')}>
          <MetricValue snapshotId={snapshotId} metric="numOfTuxSvcs" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.tuxedoAppApplication.ts_avgResTime')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['ts_avgResTime'],
              labels: [t('in-forge:plugins.tuxedoAppApplication.ts_avgResTime')],
              type: 'line',
              formatter: zeroDecimalPlaces
            }}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.tuxedoAppApplication.ts_throughput')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['ts_throughput'],
              labels: [t('in-forge:plugins.tuxedoAppApplication.ts_throughput')],
              type: 'line',
              formatter: twoDecimalPlaces
            }}
          />
        </DashboardSection>
      </Columize>
      <TuxedoServiceTable snapshot={snapshot} timeConfig={timeConfig} snapshotId={snapshotId} />
      <Columize>
        <DashboardSection title={t('in-forge:plugins.tuxedoAppApplication.sbp_avgResTime')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['sbp_avgResTime'],
              labels: [t('in-forge:plugins.tuxedoAppApplication.sbp_avgResTime')],
              type: 'line',
              formatter: zeroDecimalPlaces
            }}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.tuxedoAppApplication.sbp_throughput')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['sbp_throughput'],
              labels: [t('in-forge:plugins.tuxedoAppApplication.sbp_throughput')],
              type: 'line',
              formatter: twoDecimalPlaces
            }}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.tuxedoAppApplication.sbp_errors')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['sbp_errors'],
              labels: [t('in-forge:plugins.tuxedoAppApplication.sbp_errors')],
              type: 'line',
              formatter: twoDecimalPlaces
            }}
          />
        </DashboardSection>

        <DashboardSection title={t('in-forge:plugins.tuxedoAppApplication.sbp_timeBreakdown')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['sbp_preCallTime', 'sbp_callTime', 'sbp_postCallTime'],
              labels: [
                t('in-forge:plugins.tuxedoAppApplication.sbp_preCallTime'),
                t('in-forge:plugins.tuxedoAppApplication.sbp_callTime'),
                t('in-forge:plugins.tuxedoAppApplication.sbp_postCallTime')
              ],
              type: 'line',
              formatter: zeroDecimalPlaces
            }}
          />
        </DashboardSection>
      </Columize>
      <ServiceBrokerProjectTable snapshot={snapshot} timeConfig={timeConfig} snapshotId={snapshotId} />
    </div>
  );
}
