/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import { number, seconds, bytes, micros } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function GcpPubSubSubscriptionDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.googleCloudPubSubSubscription.dashboard.messagesSize')}>
          <MetricValue snapshotId={snapshotId} metric="backlog_bytes" formatter={bytes.detailed} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.googleCloudPubSubSubscription.dashboard.undeliveredMessages')}>
          <MetricValue snapshotId={snapshotId} metric="num_undelivered_messages" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.googleCloudPubSubSubscription.dashboard.messages')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: [`backlog_bytes`],
            labels: [t('in-forge:plugins.googleCloudPubSubSubscription.dashboard.size')],
            type: 'line',
            formatter: bytes.detailed
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.googleCloudPubSubSubscription.dashboard.messages')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            tooltipFormatter: number.compact,
            metrics: [
              `ack_message_count`,
              `num_undelivered_messages`,
              `dead_letter_message_count`,
              `num_outstanding_messages`,
              `sent_message_count`
            ],
            labels: [
              t('in-forge:plugins.googleCloudPubSubSubscription.dashboard.acked'),
              t('in-forge:plugins.googleCloudPubSubSubscription.dashboard.unacked'),
              t('in-forge:plugins.googleCloudPubSubSubscription.dashboard.deadLetter'),
              t('in-forge:plugins.googleCloudPubSubSubscription.dashboard.outstanding'),
              t('in-forge:plugins.googleCloudPubSubSubscription.dashboard.sent')
            ],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.googleCloudPubSubSubscription.dashboard.oldestMessageAge')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: seconds.detailed,
            tooltipFormatter: seconds.detailed,
            metrics: [`oldest_retained_acked_message_age`, `oldest_unacked_message_age`],
            labels: [
              t('in-forge:plugins.googleCloudPubSubSubscription.dashboard.acked'),
              t('in-forge:plugins.googleCloudPubSubSubscription.dashboard.unacked')
            ],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.googleCloudPubSubSubscription.dashboard.messageOperations')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            tooltipFormatter: number.compact,
            metrics: [`pull_message_operation_count`, `pull_ack_message_operation_count`],
            labels: [
              t('in-forge:plugins.googleCloudPubSubSubscription.dashboard.pull'),
              t('in-forge:plugins.googleCloudPubSubSubscription.dashboard.ack')
            ],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.googleCloudPubSubSubscription.dashboard.requests')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            tooltipFormatter: number.compact,
            metrics: [`pull_request_count`, `push_request_count`, `pull_ack_request_count`],
            labels: [
              t('in-forge:plugins.googleCloudPubSubSubscription.dashboard.pull'),
              t('in-forge:plugins.googleCloudPubSubSubscription.dashboard.push'),
              t('in-forge:plugins.googleCloudPubSubSubscription.dashboard.ack')
            ],
            type: 'line'
          }}
          y2={{
            formatter: micros.detailed,
            metrics: [`push_request_latencies`],
            labels: [t('in-forge:plugins.googleCloudPubSubSubscription.dashboard.pushLatency')],
            type: 'line'
          }}
        />
      </DashboardSection>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.googleCloudPubSubSubscription.dashboard.configUpdates')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: [`config_updates_count`],
              labels: [t('in-forge:plugins.googleCloudPubSubSubscription.dashboard.count')],
              type: 'line',
              formatter: number.compact
            }}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.googleCloudPubSubSubscription.dashboard.operations')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: [`byte_cost`],
              labels: [t('in-forge:plugins.googleCloudPubSubSubscription.dashboard.cost')],
              type: 'line',
              formatter: bytes.detailed
            }}
          />
        </DashboardSection>
      </Columize>
    </div>
  );
}
