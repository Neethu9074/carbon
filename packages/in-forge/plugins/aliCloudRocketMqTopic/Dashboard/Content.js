/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default function AliCloudRocketMqTopicDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <DashboardSection title={t('in-forge:plugins.aliCloudRocketMqTopic.topic1HourTitle')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            type: 'line',
            metrics: ['ReceiveMessageCountPerTopic1Hour', 'SendMessageCountPerTopic1Hour'],
            labels: [
              t('in-forge:plugins.aliCloudRocketMqTopic.receiveMessageCountPerTopic1Hour'),
              t('in-forge:plugins.aliCloudRocketMqTopic.sendMessageCountPerTopic1Hour')
            ],
            formatter: number.compact
          }}
          y2={{
            type: 'line',
            metrics: ['ReceiveMessageCountPerTopicTps1Hour', 'SendMessageCountPerTopicTps1Hour'],
            labels: [
              t('in-forge:plugins.aliCloudRocketMqTopic.receiveMessageCountPerTopicTps1Hour'),
              t('in-forge:plugins.aliCloudRocketMqTopic.sendMessageCountPerTopicTps1Hour')
            ],
            formatter: number.detailed
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.aliCloudRocketMqTopic.sendMessageCountPerTopic')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['SendMessageCountPerTopic'],
            labels: [t('in-forge:plugins.aliCloudRocketMqTopic.sendMessageCountPerTopic')],
            type: 'line',
            formatter: number.compact
          }}
          y2={{
            metrics: ['SendMessageCountPerTopicTps'],
            labels: [t('in-forge:plugins.aliCloudRocketMqTopic.sendMessageCountPerTopicTps')],
            type: 'line',
            formatter: number.detailed
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.aliCloudRocketMqTopic.receiveMessageCountPerTopic')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['ReceiveMessageCountPerTopic'],
            labels: [t('in-forge:plugins.aliCloudRocketMqTopic.receiveMessageCountPerTopic')],
            type: 'line',
            formatter: number.compact
          }}
          y2={{
            metrics: ['ReceiveMessageCountPerTopicTps'],
            labels: [t('in-forge:plugins.aliCloudRocketMqTopic.receiveMessageCountPerTopicTps')],
            type: 'line',
            formatter: number.detailed
          }}
        />
      </DashboardSection>
    </div>
  );
}
