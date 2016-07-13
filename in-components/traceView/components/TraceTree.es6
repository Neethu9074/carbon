import React from 'react';

import {selectedTrace, selectedTraceId} from 'in-stores/traces';
import LoadingIndicator from 'in-components/LoadingIndicator';
import connectTo from 'in-hoc/connectTo';
import {getLabel} from 'in-sdk/tracing';

import './TraceTree.less';

const block = 'in-trace-view-tree';

function TreeElement({span}) {
  return (
    <li>
      {getLabel(span)}

      <ul>
        {span.get('childSpans').toArray().map(childSpan =>
          <TreeElement span={childSpan}
                       key={childSpan.get('spanId')}/>
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
        Le Trace!

        <ul>
          <TreeElement span={trace}/>
        </ul>
      </div>
    );
  }
);
