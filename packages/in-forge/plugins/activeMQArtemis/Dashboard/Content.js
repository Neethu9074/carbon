import React from 'react';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import DashboardNotification from 'in-components/DashboardNotification';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number, percentage } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import { emptyList } from 'in-services/fixedImmutables';
import MetricValue from 'in-components/MetricValue';
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
        <KpiKeyValue label="Addresses">{snapshot.getIn(['data', 'addressNames'], emptyList).size}</KpiKeyValue>
        <KpiKeyValue label="Queues">{snapshot.getIn(['data', 'queueNames'], emptyList).size}</KpiKeyValue>

        <KpiKeyValue label="All Queues Messages Count">
          <MetricValue snapshotId={snapshotId} metric="totalMessageCount" />
        </KpiKeyValue>
        <KpiKeyValue label="Address Memory Usage">
          <MetricValue snapshotId={snapshotId} metric="addressMemoryUsagePercentage" formatter={percentage.detailed} />
        </KpiKeyValue>
      </KpiSection>

      <Columize>
        <DashboardSection title="Broker wide messages">
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: [
                'totalMessagesAdded',
                'totalMessagesAcknowledged',
                'totalMessagesExpired',
                'totalMessagesKilled'
              ],
              labels: ['Added', 'Acknowledged', 'Expired', 'Killed'],
              type: 'line'
            }}
          />
        </DashboardSection>
        <DashboardSection title="Broker wide message">
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['totalMessageCount'],
              labels: ['Count'],
              type: 'line'
            }}
          />
        </DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title="Broker wide connections and consumers">
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              tooltipFormatter: number.compact,
              metrics: ['totalConnectionCount', 'totalConsumerCount'],
              labels: ['Total Connections', 'Total Consumers'],
              type: 'line'
            }}
          />
        </DashboardSection>
        <DashboardSection title="Memory usage">
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: percentage,
              min: 0,
              max: 1,
              metrics: ['addressMemoryUsagePercentage'],
              labels: ['Address Memory Usage'],
              type: 'line'
            }}
          />
        </DashboardSection>
      </Columize>

      <QueuesTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
