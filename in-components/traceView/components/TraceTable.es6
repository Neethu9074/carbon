import Infinite from 'react-infinite';
import React from 'react';

import TraceTableRow from 'in-components/traceView/components/TraceTableRow';
import * as traceViewStore from 'in-components/traceView/traceViewStore';
import getElementDimensions from 'in-hoc/getElementDimensions';
import LoadingIndicator from 'in-components/LoadingIndicator';
import {
  selectedTraceId,
  setSelectedTraceId,
  clearTraceSelection
} from 'in-stores/traces';
import connectTo from 'in-hoc/connectTo';

import './TraceTable.less';


const block = 'in-trace-table';
const rpt = React.PropTypes;

export default getElementDimensions(connectTo({
    selectedTraceId,
    traces: traceViewStore.traces$,
    isInfiniteLoading: traceViewStore.isLoading$
  }, React.createClass({
  displayName: 'TraceTable',

  propTypes: {
    isInfiniteLoading: rpt.bool.isRequired,
    traces: rpt.array.isRequired,
    selectedTraceId: rpt.string,
    height: rpt.number
  },

  componentWillUnmount() {
    traceViewStore.clear();
  },

  render() {
    return (
      <div className={block}>
        {this.props.height ?
          <Infinite containerHeight={this.props.height - 24 /* Height of the header */}
                    elementHeight={26}
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
      clearTraceSelection();
    } else {
      setSelectedTraceId(traceId);
    }
  }
})));
