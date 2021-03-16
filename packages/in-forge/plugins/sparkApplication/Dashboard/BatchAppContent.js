/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import semver from 'semver';
import React from 'react';

import ExecutorsBatchAppTableBeforeV200 from './ExecutorsBatchAppTableBeforeV200';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import ExecutorsBatchAppTable from './ExecutorsBatchAppTable';
import StagesTableBeforeV160 from './StagesTableBeforeV160';
import StagesTable from './StagesTable';
import { t } from 'in-i18n';

export default function BatchAppContent({ snapshot, timeConfig }) {
  const version = snapshot.getIn(['data', 'version'], '2.0.0');
  const stagesTable = semver.satisfies(version, '>=1.6.0') ? (
    <StagesTable snapshot={snapshot} />
  ) : (
    <StagesTableBeforeV160 snapshot={snapshot} />
  );
  return (
    <div>
      <DashboardSection title={t('in-forge:plugins.sparkApplication.dashboard.jobs')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: ['failedJobs', 'completedJobs', 'activeJobs'],
            labels: [
              t('in-forge:plugins.sparkApplication.dashboard.allFailedJobs'),
              t('in-forge:plugins.sparkApplication.dashboard.allCompletedJobs'),
              t('in-forge:plugins.sparkApplication.dashboard.allActiveJobs')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.sparkApplication.dashboard.stages')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: ['pendingStages', 'failedStages', 'completedStages', 'activeStages'],
            labels: [
              t('in-forge:plugins.sparkApplication.dashboard.allPendingStages'),
              t('in-forge:plugins.sparkApplication.dashboard.allFailedStages'),
              t('in-forge:plugins.sparkApplication.dashboard.allCompletedStages'),
              t('in-forge:plugins.sparkApplication.dashboard.allActiveStages')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      {stagesTable}
      {semver.satisfies(version, '>=2.0.0') ? (
        <ExecutorsBatchAppTable snapshot={snapshot} timeConfig={timeConfig} />
      ) : (
        <ExecutorsBatchAppTableBeforeV200 snapshot={snapshot} timeConfig={timeConfig} />
      )}
    </div>
  );
}
