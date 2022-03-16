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

export default function IbmMqTopicDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.ibmMqTopic.dashboard.messages')}>
          <MetricValue snapshotId={snapshotId} metric="messagesCount" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.ibmMqTopic.dashboard.publications')}>
          <MetricValue snapshotId={snapshotId} metric="publishCount" formatter={number.detailed} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.ibmMqTopic.dashboard.messages')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            tooltipFormatter: number.compact,
            metrics: [`messagesCount`],
            labels: [t('in-forge:plugins.ibmMqTopic.dashboard.count')],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.ibmMqTopic.dashboard.publications')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.detailed,
            tooltipFormatter: number.detailed,
            metrics: [`publishCount`],
            labels: [t('in-forge:plugins.ibmMqTopic.dashboard.count')],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.ibmMqTopic.dashboard.subscriptions')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.detailed,
            tooltipFormatter: number.detailed,
            metrics: [`subscriptionCount`],
            labels: [t('in-forge:plugins.ibmMqTopic.dashboard.count')],
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}
