import React from 'react';

import { number, bytesTwoDecimalPlaces, millis } from 'in-services/formatters/number';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import Columize from 'in-sdk/components/dashboard/Columize';
import MetricValue from 'in-components/MetricValue';
import TopicsTable from './TopicsTable';
import QueuesTable from './QueuesTable';

export default function TibcoDashboard({ snapshot, timeConfig }) {
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');
  if (sensorConnectionStatus === 'STATISTICS_DISABLED') {
    return (
      <DashboardNotification type="info">
        Please enable statistics for Tibco EMS to enable metric collection. Add <code>statistics = enabled</code> to{' '}
        <strong>tibemsd.conf</strong> file and restart the server or run <code>set server statistics=enabled</code>{' '}
        using <strong>tibemsadmin</strong>.
      </DashboardNotification>
    );
  } else if (sensorConnectionStatus !== 'OK') {
    return (
      <DashboardNotification type="info">
        To enable metric collection, please add <strong>tibjms-8.5.1.jar</strong> and{' '}
        <strong>tibjmsadmin-8.5.1.jar</strong> to {'<'}
        agent_install_dir
        {'>'}
        /system/com/tibco/tibjms/tibjms/8.5.1 and {'<'}
        agent_install_dir
        {'>'}
        /system/com/tibco/tibjms/tibjmsadmin/8.5.1 respetively.
      </DashboardNotification>
    );
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
          <MetricValue snapshotId={snapshotId} metric="uptime" formatter={millis.compact} />
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
            renderPostChartContent={PluginDashboardsMarkerLanes}
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
            renderPostChartContent={PluginDashboardsMarkerLanes}
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
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <Columize>
        <DashboardSection title="Pending Messages">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['pendingMessagesCount'],
              labels: ['Count'],
              type: 'line'
            }}
            y2={{
              formatter: bytesTwoDecimalPlaces,
              metrics: ['pendingMessagesSize'],
              labels: ['Size'],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
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
            renderPostChartContent={PluginDashboardsMarkerLanes}
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
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <TopicsTable snapshot={snapshot} timeConfig={timeConfig} />
      <QueuesTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
