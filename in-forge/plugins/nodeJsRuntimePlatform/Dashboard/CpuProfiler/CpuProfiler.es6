import React from 'react';

import ResultPresenter from 'in-forge/plugins/nodeJsRuntimePlatform/Dashboard/CpuProfiler/ResultPresenter';
import {startProfiling} from 'in-forge/plugins/nodeJsRuntimePlatform/Dashboard/CpuProfiler/store';
import Button from 'in-components/Button';

export default function CpuProfiler({snapshot}) {
  return (
    <div>
      <Button onClick={() => startProfiling(snapshot, 1000 * 10)}>
        Gather CPU Profile for 10 seconds
      </Button>

      <ResultPresenter snapshot={snapshot} />
    </div>
  );
}
