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
            metrics: ['putNums', 'getNums'],
            labels: [t('in-forge:plugins.rocketMqTopic.putNums'), t('in-forge:plugins.rocketMqTopic.getNums')],
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
            metrics: ['putMessageSize', 'getMessageSize'],
            labels: [
              t('in-forge:plugins.rocketMqTopic.putMessageSize'),
              t('in-forge:plugins.rocketMqTopic.getMessageSize')
            ],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.rocketMqTopic.sendBackNums')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.detailed,
            metrics: ['sendBackNums'],
            labels: [t('in-forge:plugins.rocketMqTopic.sendBackNums')],
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}
