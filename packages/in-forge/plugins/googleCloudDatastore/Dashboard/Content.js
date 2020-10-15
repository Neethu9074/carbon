import React from 'react';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import DashboardNotification from 'in-components/DashboardNotification';
import { bytes, number } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import MetricValue from 'in-components/MetricValue';

export default function GcpDatastoreDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');

  if (sensorConnectionStatus !== 'OK') {
    return <DashboardNotification type="info">{sensorConnectionStatus}</DashboardNotification>;
  }

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label="Requests Count">
          <MetricValue snapshotId={snapshotId} metric="request_count" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label="Index Write Count">
          <MetricValue snapshotId={snapshotId} metric="index_write_count" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title="Requests">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            tooltipFormatter: number.compact,
            metrics: [`request_count`],
            labels: ['Count'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Index Write">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            tooltipFormatter: number.compact,
            metrics: [`index_write_count`],
            labels: ['Count'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <Columize>
        <DashboardSection title="Entity Read">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: bytes.detailed,
              tooltipFormatter: bytes.detailed,
              metrics: [`entity_read_sizes_avg`],
              labels: ['Avg'],
              type: 'line'
            }}
          />
        </DashboardSection>
        <DashboardSection title="Entity Write">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: bytes.detailed,
              tooltipFormatter: bytes.detailed,
              metrics: [`entity_write_sizes_avg`],
              labels: ['Avg'],
              type: 'line'
            }}
          />
        </DashboardSection>
      </Columize>
    </div>
  );
}
