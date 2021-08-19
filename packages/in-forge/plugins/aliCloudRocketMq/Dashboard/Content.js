/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import GroupsTable from 'in-forge/plugins/aliCloudRocketMq/Dashboard/GroupsTable';
import TopicsTable from 'in-forge/plugins/aliCloudRocketMq/Dashboard/TopicsTable';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import { number } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function AliCloudRocketMqDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.aliCloudRocketMq.messageCountPerInstanceAll')}>
          <MetricValue snapshotId={snapshotId} metric="MessageCountPerInstanceAll" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.aliCloudRocketMq.messageCountPerInstanceAllTps')}>
          <MetricValue snapshotId={snapshotId} metric="MessageCountPerInstanceAllTps" formatter={number.detailed} />
        </KpiKeyValue>
      </KpiSection>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.aliCloudRocketMq.messageCountPerInstanceAllTitle')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['MessageCountPerInstanceAll'],
              labels: [t('in-forge:plugins.aliCloudRocketMq.messageCountPerInstanceAll')],
              type: 'line',
              formatter: number.compact
            }}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.aliCloudRocketMq.messageCountPerInstanceAllTps')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['MessageCountPerInstanceAllTps'],
              labels: [t('in-forge:plugins.aliCloudRocketMq.messageCountPerInstanceAllTps')],
              type: 'line',
              formatter: number.detailed
            }}
          />
        </DashboardSection>
      </Columize>
      <DashboardSection title={t('in-forge:plugins.aliCloudRocketMq.instance1HourTitle')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            type: 'line',
            metrics: ['ReceiveMessageCountPerInstance1Hour', 'SendMessageCountPerInstance1Hour'],
            labels: [
              t('in-forge:plugins.aliCloudRocketMq.receiveMessageCountPerInstance1Hour'),
              t('in-forge:plugins.aliCloudRocketMq.sendMessageCountPerInstance1Hour')
            ],
            formatter: number.compact
          }}
          y2={{
            type: 'line',
            metrics: ['ReceiveMessageCountPerInstanceTps1Hour', 'SendMessageCountPerInstanceTps1Hour'],
            labels: [
              t('in-forge:plugins.aliCloudRocketMq.receiveMessageCountPerInstanceTps1Hour'),
              t('in-forge:plugins.aliCloudRocketMq.sendMessageCountPerInstanceTps1Hour')
            ],
            formatter: number.detailed
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.aliCloudRocketMq.sendMessageCountPerInstanceTitle')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['SendMessageCountPerInstance'],
            labels: [t('in-forge:plugins.aliCloudRocketMq.sendMessageCountPerInstance')],
            type: 'line',
            formatter: number.compact
          }}
          y2={{
            metrics: ['SendMessageCountPerInstanceTps'],
            labels: [t('in-forge:plugins.aliCloudRocketMq.sendMessageCountPerInstanceTps')],
            type: 'line',
            formatter: number.detailed
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.aliCloudRocketMq.receiveMessageCountPerInstanceTitle')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['ReceiveMessageCountPerInstance'],
            labels: [t('in-forge:plugins.aliCloudRocketMq.receiveMessageCountPerInstance')],
            type: 'line',
            formatter: number.compact
          }}
          y2={{
            metrics: ['ReceiveMessageCountPerInstanceTps'],
            labels: [t('in-forge:plugins.aliCloudRocketMq.receiveMessageCountPerInstanceTps')],
            type: 'line',
            formatter: number.detailed
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.aliCloudRocketMq.messageRetentionPeriod')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['MessageRetentionPeriod'],
            labels: [t('in-forge:plugins.aliCloudRocketMq.messageRetentionPeriod')],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
      <TopicsTable snapshot={snapshot} timeConfig={timeConfig} />
      <GroupsTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
