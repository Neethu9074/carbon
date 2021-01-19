/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import {
  bytesTwoDecimalPlaces,
  zeroDecimalPlaces,
  percentagePlainTwoDecimalPlaces,
  millis
} from 'in-services/formatters/number';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import MetricValue from 'in-components/MetricValue';
import OperationsTable from './OperationsTable.js';
import ApisTable from './ApisTable.js';

export default function AzureApiManagementDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label="Capacity">
          <MetricValue snapshotId={snapshotId} metric="metrics.Capacity" formatter={percentagePlainTwoDecimalPlaces} />
        </KpiKeyValue>

        <KpiKeyValue label="Latency">
          <MetricValue snapshotId={snapshotId} metric="metrics.Duration" formatter={millis.detailed} />
        </KpiKeyValue>
      </KpiSection>

      <Columize>
        <DashboardSection title="Capacity">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['metrics.Capacity'],
              labels: ['Capacity'],
              formatter: percentagePlainTwoDecimalPlaces,
              type: 'area',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>

        <DashboardSection title="Latency">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['metrics.Duration'],
              labels: ['Overall Duration of Gateway Requests'],
              formatter: millis.detailed,
              type: 'area',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <DashboardSection title="Gateway Requests">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: [
              'metrics.TotalRequests',
              'metrics.SuccessfulRequests',
              'metrics.UnauthorizedRequests',
              'metrics.FailedRequests',
              'metrics.OtherRequests'
            ],
            labels: [
              'Total Requests',
              'Successful Requests',
              'Unauthorized Requests',
              'Failed Requests',
              'Other Requests'
            ],
            formatter: zeroDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Event Hub Events">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: [
              'metrics.EventHubTotalEvents',
              'metrics.EventHubSuccessfulEvents',
              'metrics.EventHubTotalFailedEvents',
              'metrics.EventHubRejectedEvents',
              'metrics.EventHubThrottledEvents',
              'metrics.EventHubTimedoutEvents',
              'metrics.EventHubDroppedEvents'
            ],
            labels: [
              'Total Events',
              'Successful Events',
              'Failed Events',
              'Rejected Events',
              'Throttled Events',
              'Timed Out Events',
              'Dropped Events'
            ],
            formatter: zeroDecimalPlaces,
            type: 'line'
          }}
          y2={{
            min: 0,
            metrics: ['metrics.EventHubTotalBytesSent'],
            labels: ['Size of EventHub Events'],
            formatter: bytesTwoDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <ApisTable snapshot={snapshot} timeConfig={timeConfig} />
      <OperationsTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
