/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import getMonitoringIssuesForSnapshot from 'in-subscription/getMonitoringIssuesForSnapshot';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { agentMonitoringIssuesEnabled } from 'in-services/featureFlags';
import { number } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';
import { Trans, t } from 'in-i18n';
import theme from 'in-themes';

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
        <Trans
          i18nKey="in-forge:plugins.springbootAppContainer.warningTooManyMetrics"
          components={{
            linkToSpring: <Link href="https://github.com/spring-projects/spring-boot/issues/5875" external />
          }}
        />
      </DashboardNotification>
    );
  }

  return (
    <div>
      {getActuatorConfiguredHint(snapshot, monitoringIssues)}
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.springbootAppContainer.labelActiveSessions')}>
          <MetricValue snapshotId={snapshotId} metric="metrics.httpsessions.active" />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title={t('in-forge:plugins.springbootAppContainer.titleRequests')}>
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
            labels: [
              t('in-forge:plugins.labelRequests.1xx'),
              t('in-forge:plugins.labelRequests.2xx'),
              t('in-forge:plugins.labelRequests.3xx'),
              t('in-forge:plugins.labelRequests.4xx'),
              t('in-forge:plugins.labelRequests.5xx')
            ],
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
        <DashboardSection title={t('in-forge:plugins.springbootAppContainer.titleHTTPSessions')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['metrics.httpsessions.active'],
              labels: [t('in-forge:plugins.springbootAppContainer.labelActiveSessions')],
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
        <p>{t('in-forge:plugins.springbootAppContainer.warningActuatorConfigured')}</p>
        <Trans
          i18nKey="in-forge:plugins.springbootAppContainer.warningSpringbootConfig"
          components={{
            linkToSpringboot: <Link href="https://instana.com/docs/ecosystem/spring-boot/#configuration" external />
          }}
        />
      </DashboardNotification>
    );
  }
}
