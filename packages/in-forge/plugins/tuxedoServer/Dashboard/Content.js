/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number, zeroDecimalPlaces } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import ServicesTable from './ServicesTable';
import { t } from 'in-i18n';

export default function TuxedoServerDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.tuxedoServer.queued')}>
          <MetricValue snapshotId={snapshotId} metric="numQueued" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.tuxedoServer.completed')}>
          <MetricValue snapshotId={snapshotId} metric="numCompleted" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.tuxedoServer.numOfReqs')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['numQueued', 'numCompleted'],
            labels: [t('in-forge:plugins.tuxedoServer.queued'), t('in-forge:plugins.tuxedoServer.completed')],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
        />
      </DashboardSection>

      <ServicesTable snapshot={snapshot} snapshotId={snapshotId} timeConfig={timeConfig} />
    </div>
  );
}
