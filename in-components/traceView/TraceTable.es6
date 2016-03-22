import Infinite from 'react-infinite';
import React from 'react';

import TraceTableRow from 'in-components/traceView/TraceTableRow';
import LoadingIndicator from 'in-components/LoadingIndicator';
import {
  selectedTraceId,
  setSelectedTraceId,
  clearSelectedTraceId
} from 'in-stores/traces';
import connectTo from 'in-hoc/connectTo';
import * as traceViewStore from 'in-components/traceView/traceViewStore';

const block = 'in-trace-table';

export default connectTo({
    selectedTraceId,
    traces: traceViewStore.traces$,
    isInfiniteLoading: traceViewStore.isLoading$
  }, React.createClass({
  displayName: 'TraceTable',

  propTypes: {
    selectedTraceId: React.PropTypes.string,
    traces: React.PropTypes.array.isRequired,
    isInfiniteLoading: React.PropTypes.bool.isRequired
  },

  componentWillUnmount() {
    traceViewStore.clear();
  },

  render() {
    return (
      <div className={block}>
        <Infinite containerHeight={200}
                  elementHeight={30}
                  loadingSpinnerDelegate={<LoadingIndicator />}
                  infiniteLoadBeginEdgeOffset={150}
                  onInfiniteLoad={traceViewStore.loadMoreTraces}
                  isInfiniteLoading={this.props.isInfiniteLoading}>
          {this.props.traces.map(trace =>
            <TraceTableRow key={trace.id}
                           trace={trace}
                           selectedTraceId={this.props.selectedTraceId}
                           onClick={this.onClick}/>
          )}
        </Infinite>
      </div>
    );
  },

  onClick(traceId) {
    if (this.props.selectedTraceId === traceId) {
      clearSelectedTraceId();
    } else {
      setSelectedTraceId(traceId);
    }
  }
}));
