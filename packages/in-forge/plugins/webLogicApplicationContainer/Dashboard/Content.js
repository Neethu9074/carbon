/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { healthStateFormatter } from '../healthStateFormatter';
import JMSDestinationsTable from './JMSDestinationsTable';
import { number } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import DatasourcesTable from './DatasourcesTable';
import SAFAgentsTable from './SAFAgentsTable';
import WebAppsTable from './WebAppsTable';
import theme from 'in-themes';
import { t } from 'in-i18n';

export default function Dashboard({ snapshot, timeConfig }) {
  const threadPoolStuckThreadsMetricAvailable = snapshot.getIn(['data', 'threadPool.stuckThreadsAvailable'], false);
  const threadPoolMetrics = [
    'threadPool.idleThreads',
    'threadPool.totalThreads',
    'threadPool.hoggingThreads',
    'threadPool.standbyThreads'
  ];
  const threadPoolLabels = [
    t('in-forge:plugins.webLogicAppContainer.labelIdle'),
    t('in-forge:plugins.webLogicAppContainer.labelTotal'),
    t('in-forge:plugins.webLogicAppContainer.labelHogging'),
    t('in-forge:plugins.webLogicAppContainer.labelStandBy')
  ];
  if (threadPoolStuckThreadsMetricAvailable) {
    threadPoolMetrics.push('threadPool.stuckThreads');
    threadPoolLabels.push(t('in-forge:plugins.webLogicAppContainer.labelStuck'));
  }
  const serverLogRuntimeMBeanAvailable = snapshot.getIn(
    ['data', 'serverLogMessages.serverLogRuntimeMBeanAvailable'],
    false
  );

  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.webLogicAppContainer.labelIdleThreads')}>
          <MetricValue snapshotId={snapshotId} metric="threadPool.idleThreads" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.webLogicAppContainer.labelHealthState')}>
          <MetricValue snapshotId={snapshotId} metric="health.state" formatter={healthStateFormatter} />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title={t('in-forge:plugins.webLogicAppContainer.titleThreadPool')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            metrics: threadPoolMetrics,
            labels: threadPoolLabels,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.webLogicAppContainer.labelHealthState')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: healthStateFormatter,
            metrics: ['health.state'],
            labels: [t('in-forge:plugins.webLogicAppContainer.labelHealthState')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      {serverLogRuntimeMBeanAvailable ? (
        <DashboardSection title={t('in-forge:plugins.webLogicAppContainer.titleServerLogMessagesSeverity')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: [
                'serverLogMessages.warnings',
                'serverLogMessages.errors',
                'serverLogMessages.alerts',
                'serverLogMessages.criticals',
                'serverLogMessages.emergencies'
              ],
              labels: [
                t('in-forge:plugins.webLogicAppContainer.labelWarning'),
                t('in-forge:plugins.webLogicAppContainer.labelError'),
                t('in-forge:plugins.webLogicAppContainer.labelAlert'),
                t('in-forge:plugins.webLogicAppContainer.labelCritical'),
                t('in-forge:plugins.webLogicAppContainer.labelEmergency')
              ],
              colors: [
                theme.lib.colors.pink800,
                theme.lib.colors.orange800,
                theme.lib.colors.yellow800,
                theme.lib.colors.red800,
                theme.lib.colors.indigo800
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      ) : null}

      <WebAppsTable snapshot={snapshot} timeConfig={timeConfig} />
      <DatasourcesTable snapshot={snapshot} timeConfig={timeConfig} />
      <JMSDestinationsTable snapshot={snapshot} timeConfig={timeConfig} />
      <SAFAgentsTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
