/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number, bytes, seconds } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function GcpPubSubTopicDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.googleCloudPubSubTopic.dashboard.messagesSize')}>
          <MetricValue snapshotId={snapshotId} metric="message_sizes" formatter={bytes.detailed} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.googleCloudPubSubTopic.dashboard.oldestUnackedMessageAge')}>
          <MetricValue snapshotId={snapshotId} metric="oldest_unacked_message_age" formatter={seconds.detailed} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.googleCloudPubSubTopic.dashboard.messages')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['message_sizes'],
            labels: [t('in-forge:plugins.googleCloudPubSubTopic.dashboard.size')],
            type: 'line',
            formatter: bytes.detailed
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.googleCloudPubSubTopic.dashboard.oldestMessageAge')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: seconds.detailed,
            tooltipFormatter: seconds.detailed,
            metrics: [`oldest_retained_acked_message_age`],
            labels: [t('in-forge:plugins.googleCloudPubSubTopic.dashboard.acked')],
            type: 'line'
          }}
          y2={{
            formatter: seconds.detailed,
            tooltipFormatter: seconds.detailed,
            metrics: [`oldest_unacked_message_age`],
            labels: [t('in-forge:plugins.googleCloudPubSubTopic.dashboard.unacked')],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.googleCloudPubSubTopic.dashboard.publish')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            tooltipFormatter: number.compact,
            metrics: [`send_message_operation_count`],
            labels: [t('in-forge:plugins.googleCloudPubSubTopic.dashboard.operation')],
            type: 'line'
          }}
          y2={{
            formatter: number.compact,
            tooltipFormatter: number.compact,
            metrics: [`send_request_count`],
            labels: [t('in-forge:plugins.googleCloudPubSubTopic.dashboard.requests')],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.googleCloudPubSubTopic.dashboard.operations')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: [`byte_cost`],
            labels: [t('in-forge:plugins.googleCloudPubSubTopic.dashboard.cost')],
            type: 'line',
            formatter: bytes.detailed
          }}
        />
      </DashboardSection>
    </div>
  );
}
