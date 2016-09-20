import semver from 'semver';
import React from 'react';

import ResultPresenter from 'in-forge/plugins/nodeJsRuntimePlatform/Dashboard/CpuProfiler/ResultPresenter';
import {startProfiling} from 'in-forge/plugins/nodeJsRuntimePlatform/Dashboard/CpuProfiler/store';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Button from 'in-components/Button';

export default function CpuProfiler({snapshot}) {
  const sensorVersion = snapshot.getIn(['data', 'sensorVersion']);

  if (!semver.satisfies(sensorVersion, '>=1.14.0')) {
    return null;
  }

  return (
    <DashboardSection title='CPU Profiling'>
      <Button onClick={() => startProfiling(snapshot, 1000 * 10)}>
        Gather CPU Profile for 10 seconds
      </Button>

      <ResultPresenter snapshot={snapshot} />
    </DashboardSection>
  );
}
