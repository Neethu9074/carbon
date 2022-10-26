/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default function RocketMqBrokerDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <DashboardSection title={t('in-forge:plugins.rocketMqBroker.msgTPS')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.detailed,
            metrics: ['putNums', 'getNums'],
            labels: [t('in-forge:plugins.rocketMqBroker.putNums'), t('in-forge:plugins.rocketMqBroker.getNums')],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.rocketMqBroker.elapsedTime')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.detailed,
            metrics: ['putMessageEntireTimeMax', 'getMessageEntireTimeMax'],
            labels: [
              t('in-forge:plugins.rocketMqBroker.putMessageEntireTimeMax'),
              t('in-forge:plugins.rocketMqBroker.getMessageEntireTimeMax')
            ],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.rocketMqBroker.messageTimesTotal')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.detailed,
            metrics: ['putMessageTimesTotal'],
            labels: [t('in-forge:plugins.rocketMqBroker.putMessageTimesTotal')],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.rocketMqBroker.messageSizeTotal')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.detailed,
            metrics: ['putMessageSizeTotal'],
            labels: [t('in-forge:plugins.rocketMqBroker.putMessageSizeTotal')],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.rocketMqBroker.putMessageFailedTimes')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.detailed,
            metrics: ['putMessageFailedTimes'],
            labels: [t('in-forge:plugins.rocketMqBroker.putMessageFailedTimes')],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.rocketMqBroker.tps60')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.detailed,
            metrics: ['putTps60', 'getFoundTps60', 'getMissTps60', 'getTransferedTps60'],
            labels: [
              t('in-forge:plugins.rocketMqBroker.putTps60'),
              t('in-forge:plugins.rocketMqBroker.getFoundTps60'),
              t('in-forge:plugins.rocketMqBroker.getMissTps60'),
              t('in-forge:plugins.rocketMqBroker.getTransferedTps60')
            ],
            type: 'line'
          }}
          y2={{
            formatter: number.detailed,
            metrics: ['getTotalTps60'],
            labels: [t('in-forge:plugins.rocketMqBroker.getTotalTps60')],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.rocketMqBroker.msgTotalTodayNow')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.detailed,
            metrics: ['msgGetTotalTodayNow', 'msgPutTotalTodayNow'],
            labels: [
              t('in-forge:plugins.rocketMqBroker.msgGetTotalTodayNow'),
              t('in-forge:plugins.rocketMqBroker.msgPutTotalTodayNow')
            ],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.rocketMqBroker.threadPoolQueueHeadWaitTimeMills')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.detailed,
            metrics: [
              'sendThreadPoolQueueHeadWaitTimeMills',
              'pullThreadPoolQueueHeadWaitTimeMills',
              'queryThreadPoolQueueHeadWaitTimeMills'
            ],
            labels: [
              t('in-forge:plugins.rocketMqBroker.sendThreadPoolQueueHeadWaitTimeMills'),
              t('in-forge:plugins.rocketMqBroker.pullThreadPoolQueueHeadWaitTimeMills'),
              t('in-forge:plugins.rocketMqBroker.queryThreadPoolQueueHeadWaitTimeMills')
            ],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.rocketMqBroker.threadPoolQueueSize')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.detailed,
            metrics: ['queryThreadPoolQueueSize', 'pullThreadPoolQueueSize', 'sendThreadPoolQueueSize'],
            labels: [
              t('in-forge:plugins.rocketMqBroker.queryThreadPoolQueueSize'),
              t('in-forge:plugins.rocketMqBroker.pullThreadPoolQueueSize'),
              t('in-forge:plugins.rocketMqBroker.sendThreadPoolQueueSize')
            ],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.rocketMqBroker.commitLogDiskRatio')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.detailed,
            metrics: ['commitLogDiskRatio'],
            labels: [t('in-forge:plugins.rocketMqBroker.commitLogDiskRatio')],
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}
