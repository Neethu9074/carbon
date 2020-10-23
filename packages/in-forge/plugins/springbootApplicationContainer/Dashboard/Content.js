import theme from 'in-themes';
import React from 'react';

import getMonitoringIssuesForSnapshot from 'in-subscription/getMonitoringIssuesForSnapshot';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import { agentMonitoringIssuesEnabled } from 'in-services/featureFlags';
import { number } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

export default connectTo(({ snapshot, timeConfig }) => {
  const snapshotId = snapshot.get('id');
  return {
    monitoringIssues: getMonitoringIssuesForSnapshot({ timeConfig, snapshotId })
      .filter(issuesResult => issuesResult && issuesResult.get('data'))
      .map(issuesResult => issuesResult.get('data'))
      .startWith(null)
  };
})(function SpringbootDashboard({ snapshot, timeConfig, monitoringIssues }) {
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
      {getActuatorConfiguredHint(snapshot, monitoringIssues)}
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
});

function getActuatorConfiguredHint(snapshot, monitoringIssues) {
  const status = snapshot.getIn(['data', 'status']);
  // Check if we also show the monitoring issue notification for this problem, to avoid showing both (the monitoring
  // issue notification and the old dashboard notification)
  const monitoringIssueNotificationExists = monitoringIssues?.find(
    issue =>
      issue.get('agentMonitoringCode') === 'springboot_actuator_not_configured' ||
      issue.get('agentMonitoringCode') === 'springboot_jmx_not_enabled'
  );

  if (monitoringIssueNotificationExists && agentMonitoringIssuesEnabled) {
    return null;
  }

  if (status == null) {
    return (
      <DashboardNotification type="warning">
        <p>
          Spring Boot monitoring requires that Spring Boot Actuator is configured. For Spring Boot 2.2.x and later it is
          necessary to enable JMX.
        </p>
        More info can be found on the{' '}
        <Link href="https://docs.instana.io/ecosystem/spring-boot/#configuration" external>
          Spring Boot configuration page
        </Link>
      </DashboardNotification>
    );
  }
}
