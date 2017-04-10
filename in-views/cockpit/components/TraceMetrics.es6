import React from 'react';

import { totalTraceCountWithoutEum$, totalTraceCountOnlyEum$ } from 'in-stores/traces';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import Metric from 'in-views/cockpit/components/Metric';
import Count from 'in-views/traceView/components/Count';

export default function TraceMetrics() {
  return (
    <div>
      <Metric label="Server Calls">
        <Count count$={totalTraceCountWithoutEum$} formatCount={formatCount} />
      </Metric>
      <Metric label="EUM Calls">
        <Count count$={totalTraceCountOnlyEum$} formatCount={formatCount} />
      </Metric>
    </div>
  );
}

function formatCount(count) {
  return (
    <span>
      {zeroDecimalPlaces(count)}
    </span>
  );
}
