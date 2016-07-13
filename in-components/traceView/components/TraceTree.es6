import React from 'react';

import {msZeroDecimalPlaces, percentageTwoDecimalPlaces} from 'in-services/formatters/number';
import TraceFlameGraph from 'in-components/traceView/components/TraceFlameGraph';
import {selectedTrace, selectedTraceId} from 'in-stores/traces';
import LoadingIndicator from 'in-components/LoadingIndicator';
import {getLabel} from 'in-sdk/tracing';
import connectTo from 'in-hoc/connectTo';

import './TraceTree.less';

const block = 'in-trace-view-tree';

function TreeElement({span, parentSpanForPercentageCalculation = null}) {
  let newParentSpanForPercentageCalculation = parentSpanForPercentageCalculation;
  if (parentSpanForPercentageCalculation.get('async')) {
    newParentSpanForPercentageCalculation = span;
  }

  let percentageOfTotalTrace;
  if (span.get('async')) {
    percentageOfTotalTrace = 0;
  } else {
    // add a small amount to avoid division by zero
    const parentDuration = parentSpanForPercentageCalculation.get('duration') + 0.00000001;
    percentageOfTotalTrace = 1 / parentDuration * span.get('duration');
  }

  return (
    <li>
      {percentageTwoDecimalPlaces(percentageOfTotalTrace)} {msZeroDecimalPlaces(span.get('duration'))} {getLabel(span)}

      <ul>
        {span.get('childSpans').toArray()
          .filter(childSpan => !childSpan.get('async'))
          .map(childSpan =>
            <TreeElement span={childSpan}
                         key={childSpan.get('spanId')}
                         parentSpanForPercentageCalculation={newParentSpanForPercentageCalculation} />
          )}
      </ul>
    </li>
  );
}

export default connectTo({
    traceId: selectedTraceId,
    trace: selectedTrace
  }, function TraceTree({traceId, trace}) {
    if (!traceId) {
      return <p className={`${block}__no-trace-selected`}>No trace selected.</p>;
    }

    if (!trace) {
      return <LoadingIndicator type='dark' />;
    } else if (trace.get('traceId') !== traceId) {
      return <LoadingIndicator type='dark' />;
    }

    return (
      <div className={block}>
        <h1>Le Flame Graph</h1>

        <TraceFlameGraph trace={trace} />

        <h1>Le Trace Tree</h1>

        <ul>
          <TreeElement span={trace}
                       parentSpanForPercentageCalculation={trace}/>
        </ul>
      </div>
    );
  }
);
