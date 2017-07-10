import React from 'react';

import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import DashboardNotification from 'in-components/DashboardNotification';
import MetricValue from 'in-components/MetricValue';
import { getLabel } from 'in-sdk/snapshot';
import Chart from 'in-components/Chart';

const percentage = d => d + '%';

export default function ActiveMQDashboard({ snapshot, timeframe }) {
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
        <KpiHeading>
          {getLabel(snapshot)}
        </KpiHeading>
        <KpiKeyValue label="All Queues Messages Enqueue">
          <MetricValue snapshotId={snapshotId} metric="totalQueuesEnqueueCount" />
        </KpiKeyValue>
        <KpiKeyValue label="All Topics Messages Enqueue">
          <MetricValue snapshotId={snapshotId} metric="totalTopicsEnqueueCount" />
        </KpiKeyValue>
        <KpiKeyValue label="Memory Usage">
          <MetricValue snapshotId={snapshotId} metric="memoryPercentUsage" formatter={percentage} />
        </KpiKeyValue>
        <KpiKeyValue label="Storage Usage">
          <MetricValue snapshotId={snapshotId} metric="storePercentUsage" formatter={percentage} />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title="Broker wide queues message stats">
        <Chart
          snapshotId={snapshot.get('id')}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            metrics: ['totalQueuesEnqueueCount', 'totalQueuesDequeueCount'],
            labels: ['All Queues Messages Enqueue', 'All Queues Messages Dequeue'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Broker wide topics message stats">
        <Chart
          snapshotId={snapshot.get('id')}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            metrics: ['totalTopicsEnqueueCount', 'totalTopicsDequeueCount'],
            labels: ['All Topics Messages Enqueue', 'All Topics Messages Dequeue'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Broker wide connections, consumers and producers">
        <Chart
          snapshotId={snapshot.get('id')}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            metrics: ['totalConnectionsCount', 'totalProducerCount', 'totalConsumerCount'],
            labels: ['Total Connections', 'Total Producers', 'Total Consumers'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Memory and store usage">
        <Chart
          snapshotId={snapshot.get('id')}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            metrics: ['memoryPercentUsage', 'storePercentUsage'],
            labels: ['Memory Usage', 'Store Usage'],
            formatter: percentage,
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}
