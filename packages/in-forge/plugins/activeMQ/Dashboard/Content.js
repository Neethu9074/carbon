/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import { number, percentage } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import { emptyList } from 'in-services/fixedImmutables';
import MetricValue from 'in-components/MetricValue';
import DLQueuesTable from './DLQueuesTable';
import TopicsTable from './TopicsTable';
import QueuesTable from './QueuesTable';

export default function ActiveMQDashboard({ snapshot, timeConfig }) {
  const version = snapshot.getIn(['data', 'version']);
  if (!version) {
    return (
      <DashboardNotification type="info">
        Jmx is not enabled. You can enable it in activemq config by setting the broker property useJmx to true.
      </DashboardNotification>
    );
  }
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label="Topics">{snapshot.getIn(['data', 'topicNames'], emptyList).size}</KpiKeyValue>
        <KpiKeyValue label="Queues">{snapshot.getIn(['data', 'queueNames'], emptyList).size}</KpiKeyValue>
        <KpiKeyValue label="DL Queues">{snapshot.getIn(['data', 'dlqueueNames'], emptyList).size}</KpiKeyValue>
        <KpiKeyValue label="All Queues Messages Enqueue">
          <MetricValue snapshotId={snapshotId} metric="totalQueuesEnqueueCount" />
        </KpiKeyValue>
        <KpiKeyValue label="All Topics Messages Enqueue">
          <MetricValue snapshotId={snapshotId} metric="totalTopicsEnqueueCount" />
        </KpiKeyValue>
        <KpiKeyValue label="Memory Usage">
          <MetricValue snapshotId={snapshotId} metric="memoryPercentage" formatter={percentage.compact} />
        </KpiKeyValue>
        <KpiKeyValue label="Storage Usage">
          <MetricValue snapshotId={snapshotId} metric="storePercentage" formatter={percentage.compact} />
        </KpiKeyValue>
      </KpiSection>

      <Columize>
        <DashboardSection title="Broker wide queues message stats">
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['totalQueuesEnqueueCount', 'totalQueuesDequeueCount'],
              labels: ['All Queues Messages Enqueue', 'All Queues Messages Dequeue'],
              type: 'stackedBar',
              aggregation: 'sum'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title="Broker wide topics message stats">
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['totalTopicsEnqueueCount', 'totalTopicsDequeueCount'],
              labels: ['All Topics Messages Enqueue', 'All Topics Messages Dequeue'],
              type: 'stackedBar',
              aggregation: 'sum'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title="Broker wide connections, consumers and producers">
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['totalConnectionsCount', 'totalProducerCount', 'totalConsumerCount'],
              labels: ['Total Connections', 'Total Producers', 'Total Consumers'],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title="Memory and store usage">
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: percentage.compact,
              min: 0,
              max: 1,
              metrics: ['memoryPercentage', 'storePercentage'],
              labels: ['Memory Usage', 'Store Usage'],
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
