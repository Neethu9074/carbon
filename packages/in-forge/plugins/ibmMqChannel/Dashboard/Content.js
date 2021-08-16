/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number, bytes } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function IbmMqChannelDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.ibmMqChannel.dashboard.bytesSent')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="bytesSent"
            timeWindowAggregation="sum"
            formatter={bytes.compact}
          />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.ibmMqChannel.dashboard.buffersSent')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="buffersSent"
            timeWindowAggregation="sum"
            formatter={number.compact}
          />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.ibmMqChannel.dashboard.messagesSent')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="messagesSent"
            timeWindowAggregation="sum"
            formatter={number.compact}
          />
        </KpiKeyValue>
      </KpiSection>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.ibmMqChannel.dashboard.bytesReceived')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="bytesReceived"
            timeWindowAggregation="sum"
            formatter={bytes.compact}
          />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.ibmMqChannel.dashboard.buffersReceived')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="buffersReceived"
            timeWindowAggregation="sum"
            formatter={number.compact}
          />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.ibmMqChannel.dashboard.messagesAvailable')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="messagesAvailable"
            timeWindowAggregation="sum"
            formatter={number.compact}
          />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.ibmMqChannel.dashboard.messages')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            tooltipFormatter: number.compact,
            metrics: [`messagesSent`, `messagesAvailable`],
            labels: [
              t('in-forge:plugins.ibmMqChannel.dashboard.sentReceived'),
              t('in-forge:plugins.ibmMqChannel.dashboard.available')
            ],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.ibmMqChannel.dashboard.sequenceNumber')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            tooltipFormatter: number.compact,
            metrics: [`sequenceNumberCurrent`, `sequenceNumberLast`],
            labels: [
              t('in-forge:plugins.ibmMqChannel.dashboard.current'),
              t('in-forge:plugins.ibmMqChannel.dashboard.last')
            ],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.ibmMqChannel.dashboard.buffers')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            tooltipFormatter: number.compact,
            metrics: [`buffersSent`, `buffersReceived`],
            labels: [
              t('in-forge:plugins.ibmMqChannel.dashboard.buffersSent'),
              t('in-forge:plugins.ibmMqChannel.dashboard.buffersReceived')
            ],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.ibmMqChannel.dashboard.bytes')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            tooltipFormatter: number.compact,
            metrics: [`bytesSent`, `bytesReceived`],
            labels: [
              t('in-forge:plugins.ibmMqChannel.dashboard.bytesSent'),
              t('in-forge:plugins.ibmMqChannel.dashboard.bytesReceived')
            ],
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}
