import Infinite from 'react-infinite';
import React from 'react';

import {
  traces$,
  isLoading$,
  loadMoreTraces
} from 'in-components/traceView/stores/traceList';
import {
  selectedTraceId,
  setSelectedTraceId,
  clearTraceSelection
} from 'in-stores/traces';
import TraceTableRow from 'in-components/traceView/components/TraceTableRow';
import getElementDimensions from 'in-hoc/getElementDimensions';
import LoadingIndicator from 'in-components/LoadingIndicator';
import connectTo from 'in-hoc/connectTo';

import './TraceTable.less';


const block = 'in-trace-table';
const rpt = React.PropTypes;

export default getElementDimensions(connectTo({
    selectedTraceId,
    traces: traces$,
    isInfiniteLoading: isLoading$
  }, React.createClass({
  displayName: 'TraceTable',

  propTypes: {
    isInfiniteLoading: rpt.bool.isRequired,
    traces: rpt.array.isRequired,
    selectedTraceId: rpt.string,
    height: rpt.number
  },

  render() {

    return (
      <div className={block}>
        {this.props.traces.length === 0 && !this.props.isInfiniteLoading ?
          <p className={`${block}__no-traces`}>
            There are no traces in the selected time window.
          </p>
        : null}
        {this.props.height && (this.props.traces.length > 0 || this.props.isInfiniteLoading) ?
          <Infinite containerHeight={this.props.height - 24 /* Height of the header */}
                    elementHeight={26}
                    loadingSpinnerDelegate={<LoadingIndicator type='dark' />}
                    infiniteLoadBeginEdgeOffset={this.props.height * 0.5}
                    onInfiniteLoad={loadMoreTraces}
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
