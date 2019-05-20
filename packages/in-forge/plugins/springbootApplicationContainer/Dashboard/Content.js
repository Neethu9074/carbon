import React from 'react';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import DashboardNotification from 'in-components/DashboardNotification';
import MetricValue from 'in-components/MetricValue';
import Link from 'in-components/Link';
import theme from 'in-themes';

export default function SpringbootDashboard({ snapshot, timeConfig }) {
  const httpSessionsMax = snapshot.getIn(['data', 'httpsessionsMax']);
  const snapshotId = snapshot.get('id');

  if (snapshot.getIn(['data', 'tooManyMetrics'], false)) {
    return (
      <DashboardNotification type="warning">
        Metric collections was stopped because there are too many registered metrics in this Spring Boot application.{' '}
        This can be due to a bug in{' '}
        <Link href="https://github.com/spring-projects/spring-boot/issues/5875" external>
          Spring Boot
        </Link>
        .
      </DashboardNotification>
    );
  }

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label="All Requests">
          <MetricValue snapshotId={snapshotId} metric="metrics.requests" />
        </KpiKeyValue>
        <KpiKeyValue label="Active Sessions">
          <MetricValue snapshotId={snapshotId} metric="metrics.httpsessions.active" />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title="Request Count">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: [
              'metrics.requests',
              'metrics.statusCode.1xx',
              'metrics.statusCode.2xx',
              'metrics.statusCode.3xx',
              'metrics.statusCode.4xx',
              'metrics.statusCode.5xx'
            ],
            labels: [
              'All Requests',
              'Requests with Status Code 1xx',
              'Requests with Status Code 2xx',
              'Requests with Status Code 3xx',
              'Requests with Status Code 4xx',
              'Requests with Status Code 5xx'
            ],
            colors: [
              theme.lib.colors.indigo800,
              theme.lib.colors.lightBlue800,
              theme.lib.colors.green800,
              theme.lib.colors.yellow800,
              theme.lib.colors.orange800,
              theme.lib.colors.red800
            ],
            type: 'line'
          }}
        />
      </DashboardSection>
      {httpSessionsMax ? (
        <DashboardSection title="HTTP Sessions Active">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['metrics.httpsessions.active'],
              labels: ['Active Sessions'],
              type: 'line'
            }}
          />
        </DashboardSection>
      ) : null}
    </div>
  );
}
