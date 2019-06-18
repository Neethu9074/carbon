import React from 'react';

import ErrorIndicator from 'in-analyze/TraceDetail/components/ErrorIndicator';
import locals from './ErroneousTraceIndicator.mless';

export default function ErroneousTraceIndicator({ errorCount }) {
  return (
    <div className={locals.indicatorWrapper}>
      <ErrorIndicator errorCount={errorCount} />
      <span className={locals.label}>Erroneous Trace</span>
    </div>
  );
}
