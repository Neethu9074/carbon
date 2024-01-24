/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { bytes, number } from 'in-services/formatters/number';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

export default function AzureServiceBusQueueDashboard({
  snapshot,
  timeConfig
}: {
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <DashboardSection title={t('in-forge:plugins.azureServiceBus.dashboard.labelSize')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: bytes.detailed,
            metrics: ['size'],
            labels: [t('in-forge:plugins.azureServiceBus.dashboard.labelDimensionSize')],
            type: 'line',
            min: 0
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.azureServiceBus.dashboard.labelMessages')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            metrics: ['activeMessages'],
            labels: [t('in-forge:plugins.azureServiceBus.dashboard.labelActiveMessages')],
            type: 'line',
            min: 0
          }}
          y2={{
            formatter: number.compact,
            metrics: ['messages'],
            labels: [t('in-forge:plugins.azureServiceBus.dashboard.labelTotalMessages')],
            type: 'line',
            min: 0
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.azureServiceBus.dashboard.labelDeadletteredMessages')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            metrics: ['deadletteredMessages'],
            labels: [t('in-forge:plugins.azureServiceBus.dashboard.labelDeadletteredMessages')],
            type: 'line',
            min: 0
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.azureServiceBus.dashboard.labelScheduledMessages')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            metrics: ['scheduledMessages'],
            labels: [t('in-forge:plugins.azureServiceBus.dashboard.labelScheduledMessages')],
            type: 'line',
            min: 0
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.azureServiceBus.dashboard.labelCompleteMessage')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            metrics: ['completeMessage'],
            labels: [t('in-forge:plugins.azureServiceBus.dashboard.labelCompleteMessage')],
            type: 'line',
            min: 0
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.azureServiceBus.dashboard.labelAbandonMessage')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            metrics: ['abandonMessage'],
            labels: [t('in-forge:plugins.azureServiceBus.dashboard.labelAbandonMessage')],
            type: 'line',
            min: 0
          }}
        />
      </DashboardSection>
    </div>
  );
}
