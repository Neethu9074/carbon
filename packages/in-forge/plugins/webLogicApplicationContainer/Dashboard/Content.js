/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import JMSDestinationsTable from './JMSDestinationsTable';
import DatasourcesTable from './DatasourcesTable';
import SAFAgentsTable from './SAFAgentsTable';
import WebAppsTable from './WebAppsTable';

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
  return (
    <div>
      <DashboardSection title={t('in-forge:plugins.webLogicAppContainer.titleThreadPool')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: threadPoolMetrics,
            labels: threadPoolLabels,
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
              formatter: zeroDecimalPlaces,
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
