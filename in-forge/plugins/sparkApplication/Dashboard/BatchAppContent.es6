import semver from 'semver';
import React from 'react';

import { zeroDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart'
import ExecutorsBatchAppTable from './ExecutorsBatchAppTable';
import ExecutorsBatchAppTableBeforeV200 from './ExecutorsBatchAppTableBeforeV200';
import StagesTable from './StagesTable';
import StagesTableBeforeV160 from './StagesTableBeforeV160';
export default function BatchAppContent({ snapshot, timeframe }) {
  const version = snapshot.getIn(['data', 'version'], '2.0.0');
  const stagesTable = semver.satisfies(version, '>=1.6.0')
    ? <StagesTable snapshot={snapshot} />
    : <StagesTableBeforeV160 snapshot={snapshot} />;
  return (
    <div>
      <DashboardSection title="Jobs">
        <Chart
          snapshotId={snapshot.get('id')}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: ['failedJobs', 'completedJobs', 'activeJobs'],
            labels: ['All Failed Jobs', 'All Completed Jobs', 'All Active Jobs'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Stages">
        <Chart
          snapshotId={snapshot.get('id')}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: ['pendingStages', 'failedStages', 'completedStages', 'activeStages'],
            labels: ['All Pending Stages', 'All Failed Stages', 'All Completed Stages', 'All Active Stages'],
            type: 'line'
          }}
        />
      </DashboardSection>
      {timeframe.to == null ? stagesTable : null}
      {semver.satisfies(version, '>=2.0.0')
        ? <ExecutorsBatchAppTable snapshot={snapshot} timeframe={timeframe} />
        : <ExecutorsBatchAppTableBeforeV200 snapshot={snapshot} timeframe={timeframe} />}
    </div>
  );
}
