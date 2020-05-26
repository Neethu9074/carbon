import React from 'react';

import { isProfiling$, lastProfilingResult$ } from 'in-forge/plugins/nodeJsRuntimePlatform/Dashboard/CpuProfiler/store';
import ResultTable from 'in-forge/plugins/nodeJsRuntimePlatform/Dashboard/CpuProfiler/ResultTable';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import DashboardNotification from 'in-components/DashboardNotification';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    lastProfilingResult: lastProfilingResult$,
    isProfiling: isProfiling$
  },
  function ResultPresenter({ isProfiling, lastProfilingResult, snapshot }) {
    if (!isProfiling && lastProfilingResult == null) {
      return null;
    }

    return (
      <div>
        {isProfiling ? <LoadingIndicator /> : null}

        {lastProfilingResult && lastProfilingResult.error ? (
          <DashboardNotification type="danger">{lastProfilingResult.error}</DashboardNotification>
        ) : null}

        {lastProfilingResult && typeof lastProfilingResult.data === 'string' ? (
          <DashboardNotification type="info">{lastProfilingResult.data}</DashboardNotification>
        ) : null}

        {lastProfilingResult && lastProfilingResult.data && typeof lastProfilingResult.data === 'object' ? (
          <ResultTable result={lastProfilingResult.data} snapshot={snapshot} />
        ) : null}
      </div>
    );
  }
);
