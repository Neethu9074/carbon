import Infinite from 'react-infinite';
import React from 'react';

import TraceTableRow from 'in-components/traceView/components/TraceTableRow';
import * as traceViewStore from 'in-components/traceView/traceViewStore';
import LoadingIndicator from 'in-components/LoadingIndicator';
import addElementHeight from 'in-hoc/addElementHeight';
import {
  selectedTraceId,
  setSelectedTraceId,
  clearSelectedTraceId
} from 'in-stores/traces';
import connectTo from 'in-hoc/connectTo';

import './TraceTable.less';

const block = 'in-trace-table';

export default addElementHeight(connectTo({
    selectedTraceId,
    traces: traceViewStore.traces$,
    isInfiniteLoading: traceViewStore.isLoading$
  }, React.createClass({
  displayName: 'TraceTable',

  propTypes: {
    selectedTraceId: React.PropTypes.string,
    traces: React.PropTypes.array.isRequired,
    isInfiniteLoading: React.PropTypes.bool.isRequired,
    height: React.PropTypes.number
  },

  componentWillUnmount() {
    traceViewStore.clear();
  },

  render() {
    return (
      <div className={block}>
        {this.props.height ?
          <Infinite containerHeight={this.props.height}
                    elementHeight={38}
                    loadingSpinnerDelegate={<LoadingIndicator type='dark' />}
                    infiniteLoadBeginEdgeOffset={this.props.height * 0.5}
                    onInfiniteLoad={traceViewStore.loadMoreTraces}
                    isInfiniteLoading={this.props.isInfiniteLoading}
                    className={block + '__scroll-area'}>
            {this.props.traces.map(trace =>
              <TraceTableRow key={trace.id}
                             trace={trace}
                             selectedTraceId={this.props.selectedTraceId}
                             onClick={this.onClick}/>
            )}
          </Infinite>
        : null}
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
})));
