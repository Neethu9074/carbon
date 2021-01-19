/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { number, bytesZeroDecimalPlaces, bytesPerSecondTwoDecimalPlaces } from 'in-services/formatters/number';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import MetricValue from 'in-components/MetricValue';

export default function GoogleCloudStorageDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label="Requests per second">
          <MetricValue snapshotId={snapshotId} metric="api.request_count" formatter={number.detailed} />
        </KpiKeyValue>
        <KpiKeyValue label="Objects Count">
          <MetricValue snapshotId={snapshotId} metric="storage.object_count" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label="Objects Size">
          <MetricValue snapshotId={snapshotId} metric="storage.total_bytes" formatter={bytesZeroDecimalPlaces} />
        </KpiKeyValue>
      </KpiSection>
      <Columize>
        <DashboardSection title="Requests">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['api.request_count'],
              labels: ['Total Count'],
              type: 'line',
              formatter: number.detailed
            }}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title="Object Requests">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['api.request_count2.ReadObject', 'api.request_count2.WriteObject'],
              labels: ['Read', 'Write'],
              type: 'line',
              formatter: number.detailed
            }}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title="Objects">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['storage.object_count'],
              labels: ['Count'],
              type: 'line',
              formatter: number.compact
            }}
            y2={{
              min: 0,
              metrics: ['storage.total_bytes'],
              labels: ['Size'],
              type: 'line',
              formatter: bytesZeroDecimalPlaces
            }}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title="Network">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['network.sent_bytes_count', 'network.received_bytes_count'],
              labels: ['Sent', 'Received'],
              type: 'line',
              formatter: bytesPerSecondTwoDecimalPlaces
            }}
          />
        </DashboardSection>
      </Columize>
    </div>
  );
}
