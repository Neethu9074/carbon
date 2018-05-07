import React from 'react';

import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import { zeroDecimalPlaces, twoDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import QueuesTable from 'in-forge/plugins/rabbitMq/Dashboard/QueuesTable';
import NodesTable from 'in-forge/plugins/rabbitMq/Dashboard/NodesTable';
import DashboardNotification from 'in-components/DashboardNotification';
import Columize from 'in-sdk/components/dashboard/Columize';
import Chart from 'in-components/Chart';
import MetricValue from 'in-components/MetricValue';
import { getLabel } from 'in-sdk/snapshot';
import { emptyMap } from 'in-services/fixedImmutables';

export default function RabbitMqDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');
  const netPartitions = snapshot.getIn(['data', 'net_partitions'], emptyMap);
  if (sensorConnectionStatus !== 'OK') {
    return <DashboardNotification type="info">{sensorConnectionStatus}</DashboardNotification>;
  }
  return (
    <div>
      {netPartitions.size > 0 && renderNetworkPartitionWarn(netPartitions)}
      <KpiSection>
        <KpiHeading>{getLabel(snapshot)}</KpiHeading>
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
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['overview.publish_rate', 'overview.deliver_rate', 'overview.ack_rate'],
            labels: ['Published per 5 seconds', 'Delivered per 5 seconds', 'Acknowledged per 5 seconds'],
            type: 'line',
            formatter: twoDecimalPlaces
          }}
        />
      </DashboardSection>
      <DashboardSection title="Message Status">
        <Columize>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['overview.messages_ready', 'overview.messages_unacknowledged', 'overview.messages'],
              labels: ['Messages ready', 'Messages unacknowledged', 'Messages total'],
              type: 'line',
              formatter: zeroDecimalPlaces
            }}
          />
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
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
        </Columize>
      </DashboardSection>

      <DashboardSection title="Overview">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['overview.consumers', 'overview.connections'],
            labels: ['Consumers', 'Connections'],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
        />
      </DashboardSection>

      <NodesTable snapshot={snapshot} timeConfig={timeConfig} />

      <QueuesTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}

function renderNetworkPartitionWarn(netPartitions) {
  return (
    <DashboardNotification type="danger">
      <div>
        <p>Network partition detected.</p>
        <p>The nature of the partition is as follows:</p>
        <table>
          <tbody>
            <tr>
              <th>Node</th>
              <th>Was partitioned from</th>
            </tr>
            {netPartitions
              .map((partFrom, node) => (
                <tr>
                  <td>{node}</td>
                  <td>{partFrom.toArray().join(',')}</td>
                </tr>
              ))
              .valueSeq()
              .toArray()}
          </tbody>
        </table>
        <br />
        <p>
          While running in this partitioned state, changes (such as queue or exchange declaration and binding) which
          take place in one partition will not be visible to other partition(s). <br />
          Other behaviour is not guaranteed. &nbsp;
          <a href="http://www.rabbitmq.com/partitions.html">More information on network partitions.</a>
        </p>
      </div>
    </DashboardNotification>
  );
}
