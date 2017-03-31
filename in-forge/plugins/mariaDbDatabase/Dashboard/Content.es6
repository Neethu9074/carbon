import React from 'react';

import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import twoDecimalPlaces from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import DashboardNotification from 'in-components/DashboardNotification';
import ChartWithLegend from 'in-components/ChartWithLegend';
import MetricValue from 'in-components/MetricValue';
import { getLabel } from 'in-sdk/snapshot';

export default function MariaDbDashboard({ snapshot, timeframe }) {
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
        <KpiKeyValue label="Queries">
          <MetricValue snapshotId={snapshotId} metric="status.QUERIES" />
        </KpiKeyValue>
        <KpiKeyValue label="Client Connections">
          <MetricValue snapshotId={snapshotId} metric="status.THREADS_CONNECTED" />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title="Clients">
        <ChartWithLegend
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 60
          }}
          y1={{
            min: 0,
            metrics: ['status.THREADS_CONNECTED', 'status.MAX_USED_CONNECTIONS', 'status.ABORTED_CONNECTS'],
            labels: ['Connections', 'Max used connections', 'Aborted connects'],
            type: 'line',
            formatter: twoDecimalPlaces
          }}
        />
      </DashboardSection>
      <DashboardSection title="Slow Queries">
        <ChartWithLegend
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            metrics: ['status.SLOW_QUERIES'],
            labels: ['Slow Queries'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Key Access">
        <ChartWithLegend
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            metrics: ['status.KEY_READ_REQUESTS', 'status.KEY_WRITE_REQUESTS'],
            labels: ['Read Requests', 'Write Requests'],
            type: 'line'
          }}
          y2={{
            metrics: ['status.KEY_READS', 'status.KEY_WRITES'],
            labels: ['Reads', 'Writes'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Aria Engine Properties">
        <ChartWithLegend
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            metrics: ['status.ARIA_PAGECACHE_READS', 'status.ARIA_PAGECACHE_WRITES'],
            labels: ['Pagecache Reads', 'Pagecache Writes'],
            type: 'line'
          }}
        />
      </DashboardSection>

    </div>
  );
}
