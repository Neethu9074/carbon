import React from 'react';

import { number, bytesTwoDecimalPlaces, millis } from 'in-services/formatters/number';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import DashboardNotification from 'in-components/DashboardNotification';
import Columize from 'in-sdk/components/dashboard/Columize';
import MetricValue from 'in-components/MetricValue';
import TopicsTable from './TopicsTable';
import QueuesTable from './QueuesTable';

export default function TibcoDashboard({ snapshot, timeConfig }) {
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');
  if (sensorConnectionStatus !== 'OK') {
    return <DashboardNotification type="info">Please provide proper drivers for Tibco EMS.</DashboardNotification>;
  }
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label="Connections">
          <MetricValue snapshotId={snapshotId} metric="connectionCount" />
        </KpiKeyValue>
        <KpiKeyValue label="Sessions">
          <MetricValue snapshotId={snapshotId} metric="sessionCount" />
        </KpiKeyValue>
        <KpiKeyValue label="UpTime">
          <MetricValue snapshotId={snapshotId} metric="uptime" formatter={millis.detailed} />
        </KpiKeyValue>
      </KpiSection>

      <Columize>
        <DashboardSection title="Connectivity">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['connectionCount', 'sessionCount'],
              labels: ['Connections', 'Sessions'],
              type: 'line'
            }}
          />
        </DashboardSection>
        <DashboardSection title="Durables">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['durableCount'],
              labels: ['Count'],
              type: 'line'
            }}
          />
        </DashboardSection>
      </Columize>

      <DashboardSection title="Storage">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            metrics: ['readOperations', 'writeOperations'],
            labels: ['Read Operations Rate', 'Write Operations Rate'],
            type: 'line'
          }}
        />
      </DashboardSection>

      <Columize>
        <DashboardSection title="Pending Messages">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['pendingMessageCount'],
              labels: ['Count'],
              type: 'line'
            }}
            y2={{
              formatter: bytesTwoDecimalPlaces,
              metrics: ['pendingMessageSize'],
              labels: ['Size'],
              type: 'line'
            }}
          />
        </DashboardSection>
        <DashboardSection title="Messages Memory">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: bytesTwoDecimalPlaces,
              metrics: ['messagesMemory'],
              labels: ['Used Memory'],
              type: 'line'
            }}
          />
        </DashboardSection>
      </Columize>

      <DashboardSection title="Messages">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            metrics: ['inMessagesCount', 'outMessagesCount'],
            labels: ['In Messages Count', 'Out Messages Count'],
            type: 'line'
          }}
          y2={{
            formatter: number.compact,
            metrics: ['inMessages', 'outMessages'],
            labels: ['In Messages Rate', 'Out Messages Rate'],
            type: 'line'
          }}
        />
      </DashboardSection>

      <TopicsTable snapshot={snapshot} timeConfig={timeConfig} />
      <QueuesTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
