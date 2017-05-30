import Infinite from 'react-infinite';
import React from 'react';

import { markedTraces$, clear, markTrace, clearTraceId } from 'in-stores/traces/analytics/markedTraces';
import { traces$, isLoading$, loadMoreTraces } from 'in-views/traceView/stores/traceList';
import { setSelectedTraceId, clearTraceSelection } from 'in-stores/traces';
import TraceTableRow from 'in-views/traceView/components/TraceTableRow';
import getElementDimensions from 'in-hoc/getElementDimensions';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { selectedTraceId } from 'in-stores/traces';
import connectTo from 'in-hoc/connectTo';

import './TraceTable.less';

const block = 'in-trace-table';

export default getElementDimensions(
  connectTo(
    {
      selectedTraceId,
      traces: traces$,
      markedTraces: markedTraces$,
      isInfiniteLoading: isLoading$
    },
    class extends React.Component {
      static displayName = 'TraceTable';

      componentWillUnmount() {
        clearTraceSelection();
        clear();
      }

      render() {
        const traces = this.props.traces;
        const isInfiniteLoading = this.props.isInfiniteLoading;
        const height = this.props.height;
        return (
          <div className={block}>
            {traces.length === 0 && !isInfiniteLoading
              ? <p className={`${block}__no-traces`}>
                  There are no traces in the selected time window.
                </p>
              : null}
            {height && (traces.length > 0 || isInfiniteLoading)
              ? <Infinite
                  containerHeight={height - 24} /* Height of the header */
                  elementHeight={26}
                  loadingSpinnerDelegate={<LoadingIndicator type="dark" />}
                  infiniteLoadBeginEdgeOffset={height * 0.5}
                  onInfiniteLoad={loadMoreTraces}
                  isInfiniteLoading={isInfiniteLoading}
                  className={block + '__scroll-area'}
                >
                  {traces.map(trace => (
                    <TraceTableRow
                      key={trace.id}
                      trace={trace}
                      selectedTraceId={this.props.selectedTraceId}
                      markedTraces={this.props.markedTraces}
                      onRowClicked={this.onRowClicked}
                    />
                  ))}
                </Infinite>
              : null}
          </div>
        );
      }

      onRowClicked = (e, trace) => {
        const isSelected = this.props.selectedTraceId === trace.id;
        const markedTraces = this.props.markedTraces;
        const isMarked = markedTraces && markedTraces.has(trace.id);

        // cmd
        if (!e.metaKey) {
          clear();
        }

        if (!isSelected || !isMarked) {
          setSelectedTraceId(trace.id);
          markTrace(trace.id, trace.raw);
        }
        if (isSelected || isMarked) {
          clearTraceSelection();
          clearTraceId(trace.id);
        }
      };
    }
  )
);
