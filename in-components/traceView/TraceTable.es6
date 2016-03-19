import Infinite from 'react-infinite';
import React from 'react';

import LoadingIndicator from 'in-components/LoadingIndicator';
import {formatDateTime} from 'in-services/formatters/date';
import {msZeroDecimalPlaces} from 'in-services/formatters/number';
import {getTraces} from 'in-stores/traces';

const block = 'in-trace-table';

export default React.createClass({
  displayName: 'TraceTable',

  getInitialState() {
    return {
      traces: [],
      isInfiniteLoading: false,
      fastestTraceDuration: null
    };
  },

  refresh() {
    this.setState({
      traces: [],
      fastestTraceDuration: null
    });
  },

  loadMoreTraces() {
    if (this.traceSubscription) {
      this.traceSubscription.dispose();
    }
    this.traceSubscription = getTraces(this.state.fastestTraceDuration).once(this.addTraces);
  },

  addTraces(newTraces) {
    const transformedTraces = newTraces.toArray().map(trace => {
      return {
        start: formatDateTime(trace.get('start')),
        duration: msZeroDecimalPlaces(trace.get('duration')),
        name: trace.get('name'),
        id: trace.get('id')
      };
    });

    const fastestTrace = newTraces.last();
    let fastestTraceDuration = null;
    if (fastestTrace) {
      fastestTraceDuration = fastestTrace.get('duration');
    }

    this.setState(state => {
      return {
        traces: state.traces.concat(transformedTraces),
        fastestTraceDuration,
        isInfiniteLoading: false
      };
    });
  },

  componentWillUnmount() {
    if (this.traceSubscription) {
      this.traceSubscription.dispose();
    }
  },

  render() {
    const traceTableRowClassName = block + '__row';

    return (
      <div className={block}>
        <Infinite containerHeight={200}
                  elementHeight={30}
                  loadingSpinnerDelegate={<LoadingIndicator />}
                  infiniteLoadBeginEdgeOffset={150}
                  onInfiniteLoad={this.onInfiniteLoad}
                  isInfiniteLoading={this.state.isInfiniteLoading}>
          {this.state.traces.map(trace =>
            <div className={traceTableRowClassName}
                 key={trace.id}
                 style={{height: '30px'}}>
              {trace.start}: {trace.name} for {trace.duration}
            </div>
          )}
        </Infinite>
      </div>
    );
  },

  onInfiniteLoad() {
    this.setState({isInfiniteLoading: true});
    this.loadMoreTraces();
  }
});
