/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import TuxedoServerTable from 'in-forge/plugins/tuxedoAppTuxedoService/Dashboard/TuxedoServerTable';
import { number, zeroDecimalPlaces, twoDecimalPlaces, millis } from 'in-services/formatters/number';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
//@ts-expect-error
import Columize from 'in-sdk/components/dashboard/Columize';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function TuxedoServiceDashboard({ snapshot, timeConfig }) {
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');
  if (sensorConnectionStatus !== 'OK') {
    return <DashboardNotification type="info">{sensorConnectionStatus}</DashboardNotification>;
  }
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.tuxedoAppTuxedoService.avgResTime')}>
          <MetricValue snapshotId={snapshotId} metric="avgResTime" formatter={millis.detailed} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.tuxedoAppTuxedoService.throughput')}>
          <MetricValue snapshotId={snapshotId} metric="throughput" formatter={number.detailed} />
        </KpiKeyValue>
      </KpiSection>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.tuxedoAppTuxedoService.avgResTime')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['avgResTime'],
              labels: [t('in-forge:plugins.tuxedoAppTuxedoService.avgResTime')],
              type: 'line',
              formatter: millis.detailed
            }}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.tuxedoAppTuxedoService.throughput')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['throughput'],
              labels: [t('in-forge:plugins.tuxedoAppTuxedoService.throughputOpsSec')],
              type: 'line',
              formatter: twoDecimalPlaces
            }}
          />
        </DashboardSection>
      </Columize>
      <DashboardSection title={t('in-forge:plugins.tuxedoAppTuxedoService.transactionAndCallTime')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: [
              'countLessHalf',
              'countHalfAndOneHalf',
              'countOneHalfAndThree',
              'countThreeAndFive',
              'countGreaterFive'
            ],
            labels: [
              t('in-forge:plugins.tuxedoAppTuxedoService.countLessHalf'),
              t('in-forge:plugins.tuxedoAppTuxedoService.countHalfAndOneHalf'),
              t('in-forge:plugins.tuxedoAppTuxedoService.countOneHalfAndThree'),
              t('in-forge:plugins.tuxedoAppTuxedoService.countThreeAndFive'),
              t('in-forge:plugins.tuxedoAppTuxedoService.countGreaterFive')
            ],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
        />
      </DashboardSection>
      <TuxedoServerTable snapshot={snapshot} timeConfig={timeConfig} snapshotId={snapshotId} />
    </div>
  );
}
