/* eslint-disable react/prop-types, react/no-multi-comp */

import React from 'react';

import { longSelectedTrace$ } from 'in-views/traceView/stores/longSelectedTrace';
import TraceFlameGraph from 'in-views/traceView/components/TraceFlameGraph';
import TreeElement from 'in-views/traceView/components/tree/Element';
import TraceHeader from 'in-views/traceView/components/tree/Header';
import { selectedTrace, selectedTraceId } from 'in-stores/traces';
import LoadingIndicator from 'in-components/LoadingIndicator';
import connectTo from 'in-hoc/connectTo';

import './TraceTree.less';

const block = 'in-trace-view-tree';

export default connectTo(
  {
    traceId: selectedTraceId,
    trace: selectedTrace,
    longTrace: longSelectedTrace$
  },
  function TraceTree({ traceId, trace, longTrace }) {
    if (!traceId) {
      return <p className={`${block}__no-trace-selected`}>No trace selected.</p>;
    }

    if (!longTrace || !longTrace.span || longTrace.span.get('traceId') !== traceId) {
      return <LoadingIndicator type="dark" />;
    }

    return (
      <div className={block}>
        <TraceHeader trace={trace} />

        <TraceFlameGraph trace={trace} />

        <div className={`${block}__tree-wrapper`}>
          <div className={`${block}__total-time-label`}>Total: </div>

          <ul className={`${block}__element-container ${block}__element-container--root`}>
            <TreeElement
              element={longTrace}
              parentSpanForPercentageCalculation={trace}
              trace={trace}
              parent={null}
              parentDepth={0}
              totalTimeIndentationDepth={0}
            />
          </ul>
        </div>
      </div>
    );
  }
);
