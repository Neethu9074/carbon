/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function IbmMqQueueUsageDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.ibmMqQueueUsage.dashboard.openInputs')}>
          <MetricValue snapshotId={snapshotId} metric="openInputs" formatter={number.detailed} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.ibmMqQueueUsage.dashboard.openOutputs')}>
          <MetricValue snapshotId={snapshotId} metric="openOutputs" formatter={number.detailed} />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title={t('in-forge:plugins.ibmMqQueueUsage.dashboard.openInputsOutputs')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.detailed,
            tooltipFormatter: number.detailed,
            metrics: ['openInputs', 'openOutputs'],
            labels: [
              t('in-forge:plugins.ibmMqQueueUsage.dashboard.inputs'),
              t('in-forge:plugins.ibmMqQueueUsage.dashboard.outputs')
            ],
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}
