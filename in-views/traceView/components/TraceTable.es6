import Infinite from 'react-infinite';
import React from 'react';

import { markedTraces$, clear, markTrace, markTraces, clearTraceId } from 'in-stores/traces/analytics/markedTraces';
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
      isInfiniteLoading: isLoading$,
      markedTraces: markedTraces$,
      selectedTraceId,
      traces: traces$
    },
    class extends React.Component {
      static displayName = 'TraceTable';

      componentWillUnmount() {
        clearTraceSelection();
        clear();
      }

      state = {
        lastMarkedIndex: 0
      };

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
                  {traces.map((trace, i) => (
                    <TraceTableRow
                      key={trace.id}
                      trace={trace}
                      selectedTraceId={this.props.selectedTraceId}
                      markedTraces={this.props.markedTraces}
                      onRowClicked={(e, trace) => this.onRowClicked(e, trace, traces, i)}
                    />
                  ))}
                </Infinite>
              : null}
          </div>
        );
      }

      onRowClicked = (e, trace, traces, indexOfClickedTrace) => {
        const traceId = trace.id;
        const markedTraces = this.props.markedTraces;
        const lastMarkedIndex = this.state.lastMarkedIndex;
        const isSelected = this.props.selectedTraceId === traceId;
        const isMarked = markedTraces && markedTraces.has(traceId);
        let markedIndex = 0;

        // cmd
        if (!e.metaKey) {
          clear();
        }

        if (!isSelected || !isMarked) {
          setSelectedTraceId(traceId);
          markTrace(traceId, trace.raw);
          markedIndex = indexOfClickedTrace;
        }
        if (isSelected || isMarked) {
          clearTraceSelection();
          clearTraceId(traceId);
        }

        if (e.shiftKey) {
          if (lastMarkedIndex !== indexOfClickedTrace) {
            const from = Math.min(lastMarkedIndex, indexOfClickedTrace);
            const to = Math.max(lastMarkedIndex, indexOfClickedTrace);
            const tracesToMark = traces.slice(from, to + 1).map(t => t.raw);
            markTraces(tracesToMark, Infinity);
          }
        }

        this.setState({
          lastMarkedIndex: markedIndex
        });
      };
    }
  )
);
