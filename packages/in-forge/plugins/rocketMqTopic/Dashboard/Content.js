/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default function RocketMqTopicDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <DashboardSection title={t('in-forge:plugins.rocketMqTopic.msgTps')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.detailed,
            metrics: ['topicPutNums', 'topicGetNums'],
            labels: [
              t('in-forge:plugins.rocketMqTopic.topicPutNums'),
              t('in-forge:plugins.rocketMqTopic.topicGetNums')
            ],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.rocketMqTopic.msgSize')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.detailed,
            metrics: ['topicPutMessageSize', 'topicGetMessageSize'],
            labels: [
              t('in-forge:plugins.rocketMqTopic.topicPutMessageSize'),
              t('in-forge:plugins.rocketMqTopic.topicGetMessageSize')
            ],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.rocketMqTopic.topicSendBackNums')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.detailed,
            metrics: ['topicSendBackNums'],
            labels: [t('in-forge:plugins.rocketMqTopic.topicSendBackNums')],
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}
