import React from 'react';

import ErroneousTraceIndicator from 'in-analyze/TraceDetail/components/ErroneousTraceIndicator';

export default {
  title: 'Templates|TraceDetail/ErroneousTraceIndicator',
  component: ErroneousTraceIndicator
};

export function Default() {
  return <ErroneousTraceIndicator errorCount={1} />;
}
