/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number, percentage } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import { emptyList } from 'in-services/fixedImmutables';
import MetricValue from 'in-components/MetricValue';
import DLQueuesTable from './DLQueuesTable';
import TopicsTable from './TopicsTable';
import QueuesTable from './QueuesTable';
import { t } from 'in-i18n';

export default function ActiveMQDashboard({ snapshot, timeConfig }) {
  const version = snapshot.getIn(['data', 'version']);
  if (!version) {
    return (
      <DashboardNotification type="info">
        {t(
          'in-forge:plugins.activeMQ.jmxIsNotEnabledYouCanEnableItInActivemqConfigBySettingTheBrokerPropertyUseJmxToTrue'
        )}
      </DashboardNotification>
    );
  }
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.activeMQ.topics')}>
          {snapshot.getIn(['data', 'topicNames'], emptyList).size}
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.activeMQ.queues')}>
          {snapshot.getIn(['data', 'queueNames'], emptyList).size}
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.activeMQ.dlQueues')}>
          {snapshot.getIn(['data', 'dlqueueNames'], emptyList).size}
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.activeMQ.allQueuesMessagesEnqueue')}>
          <MetricValue snapshotId={snapshotId} metric="totalQueuesEnqueueCount" />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.activeMQ.allTopicsMessagesEnqueue')}>
          <MetricValue snapshotId={snapshotId} metric="totalTopicsEnqueueCount" />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.activeMQ.memoryUsage')}>
          <MetricValue snapshotId={snapshotId} metric="memoryPercentage" formatter={percentage.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.activeMQ.storageUsage')}>
          <MetricValue snapshotId={snapshotId} metric="storePercentage" formatter={percentage.compact} />
        </KpiKeyValue>
      </KpiSection>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.activeMQ.brokerWideQueuesMessageStats')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['totalQueuesEnqueueCount', 'totalQueuesDequeueCount'],
              labels: [
                t('in-forge:plugins.activeMQ.allQueuesMessagesEnqueue'),
                t('in-forge:plugins.activeMQ.allQueuesMessagesDequeue')
              ],
              type: 'stackedBar',
              aggregation: 'sum'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.activeMQ.brokerWideTopicsMessageStats')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['totalTopicsEnqueueCount', 'totalTopicsDequeueCount'],
              labels: [
                t('in-forge:plugins.activeMQ.allTopicsMessagesEnqueue'),
                t('in-forge:plugins.activeMQ.allTopicsMessagesDequeue')
              ],
              type: 'stackedBar',
              aggregation: 'sum'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.activeMQ.brokerWideConnectionsConsumersAndProducers')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['totalConnectionsCount', 'totalProducerCount', 'totalConsumerCount'],
              labels: [
                t('in-forge:plugins.activeMQ.totalConnections'),
                t('in-forge:plugins.activeMQ.totalProducers'),
                t('in-forge:plugins.activeMQ.totalConsumers')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.activeMQ.memoryAndStoreUsage')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: percentage.compact,
              min: 0,
              max: 1,
              metrics: ['memoryPercentage', 'storePercentage'],
              labels: [t('in-forge:plugins.activeMQ.memoryUsage'), t('in-forge:plugins.activeMQ.storeUsage')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <TopicsTable snapshot={snapshot} timeConfig={timeConfig} />
      <QueuesTable snapshot={snapshot} timeConfig={timeConfig} />
      <DLQueuesTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
