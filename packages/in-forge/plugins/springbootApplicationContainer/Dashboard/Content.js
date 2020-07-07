import theme from 'in-themes';
import React from 'react';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import DashboardNotification from 'in-components/DashboardNotification';
import { number } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import Link from 'in-components/Link';
import Code from 'in-components/Code';

const ActuatorDependencyCode = `<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
`;

export default function SpringbootDashboard({ snapshot, timeConfig }) {
  const httpSessionsMax = snapshot.getIn(['data', 'httpsessionsMax']);
  const snapshotId = snapshot.get('id');
  const status = snapshot.getIn(['data', 'status']);

  if (status == null) {
    return (
      <DashboardNotification type="warning">
        <p>Spring Boot monitoring requires that Spring Boot Actuator is configured:</p>
        <Code code={ActuatorDependencyCode} lang="html" showLineNumbers={false} />
        More info can be found on the{' '}
        <Link href="https://docs.instana.io/ecosystem/spring-boot/#configuration" external>
          Spring Boot configuration page
        </Link>
      </DashboardNotification>
    );
  }

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
        <KpiKeyValue label="Active Sessions">
          <MetricValue snapshotId={snapshotId} metric="metrics.httpsessions.active" />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title="Requests">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: [
              'metrics.statusCode.1xx',
              'metrics.statusCode.2xx',
              'metrics.statusCode.3xx',
              'metrics.statusCode.4xx',
              'metrics.statusCode.5xx'
            ],
            labels: ['1xx', '2xx', '3xx', '4xx', '5xx'],
            colors: [
              theme.lib.colors.lightBlue800,
              theme.lib.colors.green800,
              theme.lib.colors.yellow800,
              theme.lib.colors.orange800,
              theme.lib.colors.red800
            ],
            type: 'stackedBar',
            aggregation: 'sum',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      {httpSessionsMax ? (
        <DashboardSection title="HTTP Sessions">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['metrics.httpsessions.active'],
              labels: ['Active Sessions'],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      ) : null}
    </div>
  );
}
