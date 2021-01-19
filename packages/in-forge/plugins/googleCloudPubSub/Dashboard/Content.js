/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import GcpPubSubSubscriptionsTable from 'in-forge/plugins/googleCloudPubSub/Dashboard/GcpPubSubSubscriptionsTable';
import GcpPubSubTopicsTable from 'in-forge/plugins/googleCloudPubSub/Dashboard/GcpPubSubTopicsTable';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import { bytes, seconds, number } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';

export default function GcpPubSubDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');

  if (sensorConnectionStatus !== 'OK') {
    return <DashboardNotification type="info">{sensorConnectionStatus}</DashboardNotification>;
  }

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label="Messages Count">
          <MetricValue snapshotId={snapshotId} metric="sent_message_count" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label="Messages Size">
          <MetricValue snapshotId={snapshotId} metric="backlog_bytes" formatter={bytes.detailed} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title="Messages">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            tooltipFormatter: number.compact,
            metrics: [`sent_message_count`],
            labels: ['Count'],
            type: 'line'
          }}
          y2={{
            formatter: bytes.detailed,
            tooltipFormatter: bytes.detailed,
            metrics: [`backlog_bytes`],
            labels: ['Size'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Oldest Message">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: seconds.detailed,
            tooltipFormatter: seconds.detailed,
            metrics: [`oldest_unacked_message_age`],
            labels: ['Age'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <GcpPubSubTopicsTable snapshot={snapshot} timeConfig={timeConfig} />
      <GcpPubSubSubscriptionsTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
