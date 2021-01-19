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

export default function BatchAppContent({ snapshot, timeConfig }) {
  const version = snapshot.getIn(['data', 'version'], '2.0.0');
  const stagesTable = semver.satisfies(version, '>=1.6.0') ? (
    <StagesTable snapshot={snapshot} />
  ) : (
    <StagesTableBeforeV160 snapshot={snapshot} />
  );
  return (
    <div>
      <DashboardSection title="Jobs">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: ['failedJobs', 'completedJobs', 'activeJobs'],
            labels: ['All Failed Jobs', 'All Completed Jobs', 'All Active Jobs'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Stages">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: ['pendingStages', 'failedStages', 'completedStages', 'activeStages'],
            labels: ['All Pending Stages', 'All Failed Stages', 'All Completed Stages', 'All Active Stages'],
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
