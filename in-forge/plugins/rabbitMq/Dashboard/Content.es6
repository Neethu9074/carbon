import React from 'react';

import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import { zeroDecimalPlaces, twoDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import QueuesTable from 'in-forge/plugins/rabbitMq/Dashboard/QueuesTable';
import NodesTable from 'in-forge/plugins/rabbitMq/Dashboard/NodesTable';
import DashboardNotification from 'in-components/DashboardNotification';
import TwoColumnRow from 'in-sdk/components/dashboard/TwoColumnRow';
import ChartWithLegend from 'in-components/ChartWithLegend';
import MetricValue from 'in-components/MetricValue';
import { getLabel } from 'in-sdk/snapshot';

export default function RabbitMqDashboard({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');
  if (sensorConnectionStatus !== 'OK') {
    return (
      <DashboardNotification type="info">
        {sensorConnectionStatus}
      </DashboardNotification>
    );
  }
  return (
    <div>
      <KpiSection>
        <KpiHeading>
          {getLabel(snapshot)}
        </KpiHeading>
        <KpiKeyValue label="Messages ready">
          <MetricValue snapshotId={snapshotId} metric="overview.messages_ready" />
        </KpiKeyValue>
        <KpiKeyValue label="Consumers">
          <MetricValue snapshotId={snapshotId} metric="overview.consumers" />
        </KpiKeyValue>
        <KpiKeyValue label="Connections">
          <MetricValue snapshotId={snapshotId} metric="overview.connections" />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title="Messages">
        <ChartWithLegend
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            metrics: ['overview.publish_rate', 'overview.deliver_rate', 'overview.ack_rate'],
            labels: ['Published per 5 seconds', 'Delivered per 5 seconds', 'Acknowledged per 5 seconds'],
            type: 'line',
            formatter: twoDecimalPlaces
          }}
        />
      </DashboardSection>
      <DashboardSection title="Message Status">
        <TwoColumnRow>
          <ChartWithLegend
            snapshotId={snapshotId}
            timeframe={timeframe}
            margins={{
              left: 80
            }}
            y1={{
              metrics: ['overview.messages_ready', 'overview.messages_unacknowledged', 'overview.messages'],
              labels: ['Messages ready', 'Messages unacknowledged', 'Messages total'],
              type: 'line',
              formatter: zeroDecimalPlaces
            }}
          />
          <ChartWithLegend
            snapshotId={snapshotId}
            timeframe={timeframe}
            margins={{
              left: 80
            }}
            y1={{
              metrics: [
                'overview.messages_ready_rate',
                'overview.messages_unacknowledged_rate',
                'overview.messages_rate'
              ],
              labels: ['Messages ready rate', 'Unacknowledged rate', 'Messages total rate'],
              type: 'line',
              formatter: twoDecimalPlaces
            }}
          />
        </TwoColumnRow>
      </DashboardSection>

      <DashboardSection title="Overview">
        <ChartWithLegend
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            min: 0,
            metrics: ['overview.consumers', 'overview.connections'],
            labels: ['Consumers', 'Connections'],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
        />
      </DashboardSection>

      <NodesTable snapshot={snapshot} timeframe={timeframe} />

      <QueuesTable snapshot={snapshot} timeframe={timeframe} />

    </div>
  );
}
