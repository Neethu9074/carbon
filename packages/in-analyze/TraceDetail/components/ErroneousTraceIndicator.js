import React from 'react';

import ErrorIndicator from 'in-analyze/TraceDetail/components/ErrorIndicator';
import locals from './ErroneousTraceIndicator.mless';

export default function ErroneousTraceIndicator({ errorCount }) {
  return (
    <div className={locals.indicatorWrapper}>
      <ErrorIndicator erroneous={errorCount} />
      <span className={locals.label}>Erroneous Trace</span>
    </div>
  );
}
