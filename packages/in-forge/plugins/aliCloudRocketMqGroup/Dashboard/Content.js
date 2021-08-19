/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import GroupPerTopicsTable from 'in-forge/plugins/aliCloudRocketMqGroup/Dashboard/GroupPerTopicsTable';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default function AliCloudRocketMqGroupDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <DashboardSection title={t('in-forge:plugins.aliCloudRocketMqGroup.group1HourTitle')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            type: 'line',
            metrics: ['ReceiveMessageCountPerGid1Hour', 'SendMessageCountPerGid1Hour'],
            labels: [
              t('in-forge:plugins.aliCloudRocketMqGroup.receiveMessageCountPerGid1Hour'),
              t('in-forge:plugins.aliCloudRocketMqGroup.sendMessageCountPerGid1Hour')
            ],
            formatter: number.compact
          }}
          y2={{
            type: 'line',
            metrics: ['ReceiveMessageCountPerGidTps1Hour', 'SendMessageCountPerGidTps1Hour'],
            labels: [
              t('in-forge:plugins.aliCloudRocketMqGroup.receiveMessageCountPerGidTps1Hour'),
              t('in-forge:plugins.aliCloudRocketMqGroup.sendMessageCountPerGidTps1Hour')
            ],
            formatter: number.detailed
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.aliCloudRocketMqGroup.receiveMessageCountPerGid')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['ReceiveMessageCountPerGid'],
            labels: [t('in-forge:plugins.aliCloudRocketMqGroup.receiveMessageCountPerGid')],
            type: 'line',
            formatter: number.compact
          }}
          y2={{
            metrics: ['ReceiveMessageCountPerGidTps'],
            labels: [t('in-forge:plugins.aliCloudRocketMqGroup.receiveMessageCountPerGidTps')],
            type: 'line',
            formatter: number.detailed
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.aliCloudRocketMqGroup.sendMessageCountPerGid')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['SendMessageCountPerGid'],
            labels: [t('in-forge:plugins.aliCloudRocketMqGroup.sendMessageCountPerGid')],
            type: 'line',
            formatter: number.compact
          }}
          y2={{
            metrics: ['SendMessageCountPerGidTps'],
            labels: [t('in-forge:plugins.aliCloudRocketMqGroup.sendMessageCountPerGidTps')],
            type: 'line',
            formatter: number.detailed
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.aliCloudRocketMqGroup.consumerLag')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['ConsumerLag'],
            labels: [t('in-forge:plugins.aliCloudRocketMqGroup.consumerLag')],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.aliCloudRocketMqGroup.sendDLQMessageCountPerGid')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['SendDLQMessageCountPerGid'],
            labels: [t('in-forge:plugins.aliCloudRocketMqGroup.sendDLQMessageCountPerGid')],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
      <GroupPerTopicsTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
