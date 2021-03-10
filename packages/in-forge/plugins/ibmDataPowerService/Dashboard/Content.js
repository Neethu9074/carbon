/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number, percentage, millis } from 'in-services/formatters/number';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import MetricValue from 'in-components/MetricValue';

export default function IbmDataPowerServiceDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.ibmDataPowerService.currentMemUsage')}>
          <MetricValue snapshotId={snapshotId} metric="currentMemUsage" formatter={percentage.compact} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.ibmDataPowerService.currentMemUsage')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: percentage.compact,
            tooltipFormatter: percentage.compact,
            metrics: [`currentMemUsage`],
            labels: [t('in-forge:plugins.ibmDataPowerService.currentMemUsage')],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.ibmDataPowerService.meanTransactionTime')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: millis.compact,
            tooltipFormatter: millis.compact,
            metrics: [`meanTransactionTime`],
            labels: [t('in-forge:plugins.ibmDataPowerService.meanTransactionTime')],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.ibmDataPowerService.transactionRate')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            tooltipFormatter: number.compact,
            metrics: [`throughput`],
            labels: [t('in-forge:plugins.ibmDataPowerService.throughput')],
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}
