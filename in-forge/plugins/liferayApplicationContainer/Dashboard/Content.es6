import React from 'react';

import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import MetricValue from 'in-components/MetricValue';
import { getLabel } from 'in-sdk/snapshot';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart'

export default function LiferayDashboard({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiHeading>
          {getLabel(snapshot)}
        </KpiHeading>
        <KpiKeyValue label="Average Time">
          <MetricValue snapshotId={snapshotId} metric="portalStatistics.averageTime" />
        </KpiKeyValue>
        <KpiKeyValue label="Request Count">
          <MetricValue snapshotId={snapshotId} metric="portalStatistics.requestCount" />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title="Portal Latency Overview">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            metrics: [
              'portalStatistics.averageTime',
              'portalStatistics.maxTime',
              'portalStatistics.minTime',
              'actionRequestStatistics.averageTime',
              'actionRequestStatistics.maxTime',
              'actionRequestStatistics.minTime'
            ],
            labels: [
              'Portal Average Time',
              'Portal Max Time',
              'Portal Min Time',
              'Action Request Average Time',
              'Action Request Max Time',
              'Action Request Min Time'
            ],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Requests">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            metrics: ['portalStatistics.requestCount', 'portalStatistics.successCount', 'portalStatistics.errorCount'],
            labels: ['Request Count', 'Success Count', 'Error Count'],
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}
