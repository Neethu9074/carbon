import React from 'react';

import {isProfiling$, lastProfilingResult$} from 'in-forge/plugins/nodeJsRuntimePlatform/Dashboard/CpuProfiler/store';
import ResultTable from 'in-forge/plugins/nodeJsRuntimePlatform/Dashboard/CpuProfiler/ResultTable';
import DashboardNotification from 'in-components/DashboardNotification';
import LoadingIndicator from 'in-components/LoadingIndicator';
import connectTo from 'in-hoc/connectTo';

export default connectTo({
  lastProfilingResult: lastProfilingResult$,
  isProfiling: isProfiling$
}, function ResultPresenter({isProfiling, lastProfilingResult}) {
  if (!isProfiling && lastProfilingResult == null) {
    return null;
  }

  return (
    <div>
      {isProfiling ?
        <LoadingIndicator type='dark' />
      : null}

      {lastProfilingResult && lastProfilingResult.error ?
        <DashboardNotification type='danger'>
          {lastProfilingResult.error}
        </DashboardNotification>
      : null}

      {lastProfilingResult && typeof lastProfilingResult.data === 'string' ?
        <DashboardNotification type='info'>
          {lastProfilingResult.data}
        </DashboardNotification>
      : null}

      {lastProfilingResult && typeof lastProfilingResult.data !== 'string' ?
        <ResultTable result={lastProfilingResult.data} />
      : null}
    </div>
  );
});
