/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function IbmMqQueueUsageDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.ibmMqQueueUsage.dashboard.openInputs')}>
          <MetricValue snapshotId={snapshotId} metric="openInputs" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.ibmMqQueueUsage.dashboard.openOutputs')}>
          <MetricValue snapshotId={snapshotId} metric="openOutputs" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title={t('in-forge:plugins.ibmMqQueueUsage.dashboard.openInputsOutputs')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            tooltipFormatter: number.compact,
            metrics: [`openInputs`, `openOutputs`],
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
