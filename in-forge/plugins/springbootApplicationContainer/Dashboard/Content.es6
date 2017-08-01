import React from 'react';

import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import DashboardNotification from 'in-components/DashboardNotification';
import MetricValue from 'in-components/MetricValue';
import { getLabel } from 'in-sdk/snapshot';
import Chart from 'in-components/Chart';
import Link from 'in-components/Link';

export default function SpringbootDashboard({ snapshot, timeframe }) {
  const httpSessionsMax = snapshot.getIn(['data', 'httpsessionsMax']);
  const snapshotId = snapshot.get('id');

  if (snapshot.getIn(['data', 'tooManyMetrics'], false)) {
    return (
      <DashboardNotification type="warning">
        Metric collections was stopped because there are too many registered metrics
        in this Spring Boot application.{' '}
        This can be due to a bug in{' '}
        <Link href="https://github.com/spring-projects/spring-boot/issues/5875" external>
          Spring Boot
        </Link>.
      </DashboardNotification>
    );
  }

  return (
    <div>
      <KpiSection>
        <KpiHeading>
          {getLabel(snapshot)}
        </KpiHeading>
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
          timeframe={timeframe}
          margins={{
            left: 80
          }}
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
            type: 'line'
          }}
        />
      </DashboardSection>
      {httpSessionsMax
        ? <DashboardSection title="HTTP Sessions Active">
            <Chart
              snapshotId={snapshotId}
              timeframe={timeframe}
              margins={{
                left: 80
              }}
              y1={{
                metrics: ['metrics.httpsessions.active'],
                labels: ['Active Sessions'],
                type: 'line'
              }}
            />
          </DashboardSection>
        : null}
    </div>
  );
}
