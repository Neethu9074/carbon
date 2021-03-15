/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { seconds, micros, number } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function IbmMqQueueDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.ibmMqQueue.dashboard.queueDepth')}>
          <MetricValue snapshotId={snapshotId} metric="queueDepth" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.ibmMqQueue.dashboard.oldestMessage')}>
          <MetricValue snapshotId={snapshotId} metric="oldestMessage" formatter={seconds.fixedCompact} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.ibmMqQueue.dashboard.depth')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            tooltipFormatter: number.compact,
            metrics: [`maxQueueDepth`, `queueDepth`],
            labels: [
              t('in-forge:plugins.ibmMqQueue.dashboard.max'),
              t('in-forge:plugins.ibmMqQueue.dashboard.current')
            ],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.ibmMqQueue.dashboard.messages')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            tooltipFormatter: number.compact,
            metrics: [`messagesIn`, `messagesOut`, `uncommittedMessages`],
            labels: [
              t('in-forge:plugins.ibmMqQueue.dashboard.in'),
              t('in-forge:plugins.ibmMqQueue.dashboard.out'),
              t('in-forge:plugins.ibmMqQueue.dashboard.uncommitted')
            ],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.ibmMqQueue.dashboard.messageTime')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: seconds.fixedCompact,
            tooltipFormatter: seconds.fixedCompacts,
            metrics: [`oldestMessage`],
            labels: [t('in-forge:plugins.ibmMqQueue.dashboard.oldest')],
            type: 'line'
          }}
          y2={{
            formatter: micros.compact,
            tooltipFormatter: micros.compact,
            metrics: [`onQueueMessageTime`],
            labels: [t('in-forge:plugins.ibmMqQueue.dashboard.onQueue')],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.ibmMqQueue.dashboard.reset')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: seconds.fixedCompact,
            tooltipFormatter: seconds.fixedCompact,
            metrics: [`lastResetTime`],
            labels: [t('in-forge:plugins.ibmMqQueue.dashboard.last')],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.ibmMqQueue.dashboard.calls')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            tooltipFormatter: number.compact,
            metrics: [`openInputCount`, `openOutputCount`],
            labels: [
              t('in-forge:plugins.ibmMqQueue.dashboard.openInputs'),
              t('in-forge:plugins.ibmMqQueue.dashboard.openOutputs')
            ],
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}
