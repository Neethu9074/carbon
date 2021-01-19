/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import QueuesUsageTable from 'in-forge/plugins/ibmMqQueueManager/Dashboard/QueuesUsageTable.js';
import ChannelsTable from 'in-forge/plugins/ibmMqQueueManager/Dashboard/ChannelsTable.js';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import QueuesTable from 'in-forge/plugins/ibmMqQueueManager/Dashboard/QueuesTable.js';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';

export default function IbmMqQueueManagerDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');

  if (sensorConnectionStatus !== 'OK') {
    return <DashboardNotification type="info">{sensorConnectionStatus}</DashboardNotification>;
  }
  return (
    <div>
      {getSensorConnectionStatus(snapshot)}
      <KpiSection>
        <KpiKeyValue label="Connections">
          <MetricValue snapshotId={snapshotId} metric="connectionCount" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label="Messages In">
          <MetricValue snapshotId={snapshotId} metric="messagesIn" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title="Connections">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['connectionCount'],
            labels: ['Count'],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title="Messages">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            tooltipFormatter: number.compact,
            metrics: [`messagesIn`, `messagesOut`, `uncommittedMessages`],
            labels: ['In', 'Out', 'Uncommitted'],
            type: 'line'
          }}
        />
      </DashboardSection>

      <QueuesUsageTable snapshot={snapshot} timeConfig={timeConfig} />
      <QueuesTable snapshot={snapshot} timeConfig={timeConfig} />
      <ChannelsTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}

function getSensorConnectionStatus(snapshot) {
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');
  if (sensorConnectionStatus !== 'OK') {
    return <DashboardNotification type="info">{sensorConnectionStatus}</DashboardNotification>;
  }
}
