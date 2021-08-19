/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default function AliCloudRocketMqGroupPerTopicDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <DashboardSection title={t('in-forge:plugins.aliCloudRocketMqGroupPerTopic.sendMessageCountPerGidTopic')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['SendMessageCountPerGidTopic'],
            labels: [t('in-forge:plugins.aliCloudRocketMqGroupPerTopic.sendMessageCountPerGidTopic')],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.aliCloudRocketMqGroupPerTopic.receiveMessageCountPerGidTopic')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['ReceiveMessageCountPerGidTopic'],
            labels: [t('in-forge:plugins.aliCloudRocketMqGroupPerTopic.receiveMessageCountPerGidTopic')],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.aliCloudRocketMqGroupPerTopic.consumerLagPerGidTopic')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['ConsumerLagPerGidTopic'],
            labels: [t('in-forge:plugins.aliCloudRocketMqGroupPerTopic.consumerLagPerGidTopic')],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.aliCloudRocketMqGroupPerTopic.sendDLQMessageCountPerGidTopic')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['SendDLQMessageCountPerGidTopic'],
            labels: [t('in-forge:plugins.aliCloudRocketMqGroupPerTopic.sendDLQMessageCountPerGidTopic')],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
    </div>
  );
}
