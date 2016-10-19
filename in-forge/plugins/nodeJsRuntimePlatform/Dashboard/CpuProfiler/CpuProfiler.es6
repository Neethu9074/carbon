import semver from 'semver';
import React from 'react';

import CpuProfilingButton from 'in-forge/plugins/nodeJsRuntimePlatform/Dashboard/CpuProfiler/CpuProfilingButton';
import ResultPresenter from 'in-forge/plugins/nodeJsRuntimePlatform/Dashboard/CpuProfiler/ResultPresenter';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';

export default function CpuProfiler({snapshot}) {
  const sensorVersion = snapshot.getIn(['data', 'sensorVersion']);

  if (!semver.satisfies(sensorVersion, '>=1.14.0')) {
    return null;
  }

  return (
    <DashboardSection title='CPU Profiling'>
      <CpuProfilingButton snapshot={snapshot} />

      <ResultPresenter snapshot={snapshot} />
    </DashboardSection>
  );
}
