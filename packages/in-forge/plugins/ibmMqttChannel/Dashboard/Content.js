/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number, bytes } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function IbmMqttChannelDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.ibmMqttChannel.dashboard.connections')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="connections"
            timeWindowAggregation="avg"
            formatter={bytes.compact}
          />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.ibmMqttChannel.dashboard.messagesSent')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="MQTTMessagesSent"
            timeWindowAggregation="avg"
            formatter={number.compact}
          />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.ibmMqttChannel.dashboard.messagesReceived')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="MQTTMessagesReceived"
            timeWindowAggregation="avg"
            formatter={number.compact}
          />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.ibmMqttChannel.dashboard.connections')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            tooltipFormatter: number.compact,
            metrics: [`connections`],
            labels: [
              t('in-forge:plugins.ibmMqttChannel.dashboard.connections')
            ],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.ibmMqttChannel.dashboard.messages')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            tooltipFormatter: number.compact,
            metrics: [`MQTTMessagesSent`, `MQTTMessagesReceived`],
            labels: [
              t('in-forge:plugins.ibmMqttChannel.dashboard.messagesSent'),
              t('in-forge:plugins.ibmMqttChannel.dashboard.messagesReceived')
            ],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.ibmMqttChannel.dashboard.indoubtMessages')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            tooltipFormatter: number.compact,
            metrics: [`inDoubtInput`, `inDoubtOutput`],
            labels: [
              t('in-forge:plugins.ibmMqttChannel.dashboard.inDoubtInput'),
              t('in-forge:plugins.ibmMqttChannel.dashboard.inDoubtOutput')
            ],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.ibmMqttChannel.dashboard.pendingOutbound')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            tooltipFormatter: number.compact,
            metrics: [`pendingOutbound`],
            labels: [
              t('in-forge:plugins.ibmMqttChannel.dashboard.pendingOutbound')
            ],
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}
