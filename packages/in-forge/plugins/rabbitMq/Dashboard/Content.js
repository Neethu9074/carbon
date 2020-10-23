import React from 'react';

import { zeroDecimalPlaces, twoDecimalPlaces } from 'in-services/formatters/number';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { greaterThanZeroFormatter } from 'in-forge/plugins/rabbitMq/formatters';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import QueuesTable from 'in-forge/plugins/rabbitMq/Dashboard/QueuesTable';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import NodesTable from 'in-forge/plugins/rabbitMq/Dashboard/NodesTable';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import Columize from 'in-sdk/components/dashboard/Columize';
import { emptyMap } from 'in-services/fixedImmutables';
import MetricValue from 'in-components/MetricValue';

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
        <KpiKeyValue label="Messages ready">
          <MetricValue snapshotId={snapshotId} metric="overview.messages_ready" formatter={greaterThanZeroFormatter} />
        </KpiKeyValue>
        <KpiKeyValue label="Consumers">
          <MetricValue snapshotId={snapshotId} metric="overview.consumers" formatter={greaterThanZeroFormatter} />
        </KpiKeyValue>
        <KpiKeyValue label="Connections">
          <MetricValue snapshotId={snapshotId} metric="overview.connections" formatter={greaterThanZeroFormatter} />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title="Messages (per 5 sec)">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['overview.publish_rate', 'overview.deliver_rate', 'overview.ack_rate'],
            labels: ['Published', 'Delivered', 'Acknowledged'],
            type: 'line',
            formatter: twoDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Message Status">
        <Columize>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['overview.messages_ready', 'overview.messages_unacknowledged', 'overview.messages'],
              labels: ['Ready', 'Unacknowledged', 'Total'],
              type: 'line',
              formatter: zeroDecimalPlaces
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
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
              labels: ['Ready rate', 'Unacknowledged rate', 'Total rate'],
              type: 'line',
              formatter: twoDecimalPlaces
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
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
          renderPostChartContent={PluginDashboardsMarkerLanes}
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
