import React from 'react';

import {getErrorCount, getDepth, getCalls, getPerCategorySummary} from 'in-components/traceView/util';
import SpanEntityInformation from 'in-components/traceView/components/SpanEntityInformation';
import {msZeroDecimalPlaces} from 'in-services/formatters/number';
import {formatDateTime} from 'in-services/formatters/date';
import {getLabel} from 'in-sdk/tracing';

export default function TraceHeader({trace}) {
  const errorCount = getErrorCount(trace);
  const depth = getDepth(trace);
  const calls = getCalls(trace);

  const perCategorySummary = getPerCategorySummary(trace);
  const categories = Object.keys(perCategorySummary).sort();

  return (
    <div>
      <h1>
        {getLabel(trace)}
        <SpanEntityInformation span={trace}
                               label=' on'
                               connectionEndpointType='destinationId' />
      </h1>

      <p>
        Took {msZeroDecimalPlaces(trace.get('duration'))} on {formatDateTime(trace.get('start'))} with&nbsp;
        {errorCount} errors in {calls} calls and a maximum depth of {depth}.
      </p>

      <ul>
        {categories.map(category =>
          <li key={category}>
            {perCategorySummary[category].calls} {category} calls at a total self time of&nbsp;
            {msZeroDecimalPlaces(perCategorySummary[category].durationSelf)}
          </li>
        )}
      </ul>
    </div>
  );
}
