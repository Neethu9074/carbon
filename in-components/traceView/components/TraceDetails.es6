import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import TraceWaterfallChart from 'in-components/traceView/components/TraceWaterfallChart';
import TraceHeading from 'in-components/traceView/components/TraceHeading';
import TabHeader from 'in-components/traceView/components/TabHeader';
import {msZeroDecimalPlaces} from 'in-services/formatters/number';
import {selectedTrace, selectedTraceId} from 'in-stores/traces';
import {getLabel} from 'in-sdk/tracing';
import LoadingIndicator from 'in-components/LoadingIndicator';
import {formatDateTime} from 'in-services/formatters/date';
import PropList from 'in-components/PropList';
import connectTo from 'in-hoc/connectTo';

import './TraceDetails.less';

const block = 'in-trace-details';

export default connectTo({
  traceId: selectedTraceId,
  trace: selectedTrace
}, React.createClass({
  displayName: 'TraceDetails',

  mixins: [PureRenderMixin],

  propTypes: {
    traceId: React.PropTypes.string,
    trace: irpt.map
  },

  render() {
    if (!this.props.traceId) {
      return <p>No trace selected.</p>;
    }

    if (!this.props.trace) {
      return <LoadingIndicator type='dark' />;
    } else if (this.props.trace.get('traceId') !== this.props.traceId) {
      return <LoadingIndicator type='dark' />;
    }

    return (
      <div className={block}>
        <TabHeader left={<TraceHeading>{getLabel(this.props.trace)}</TraceHeading>} />

        <PropList className={block + '__props'}>
          <PropList.Prop label='Start'
                         value={formatDateTime(this.props.trace.get('start'))} />

          <PropList.Prop label='Duration'
                         value={msZeroDecimalPlaces(this.props.trace.get('duration'))} />

          <PropList.Prop label='Depth'
                         value={this.getDepth(this.props.trace)} />

          <PropList.Prop label='Calls'
                         value={this.getCalls(this.props.trace)} />
        </PropList>

        <TraceWaterfallChart trace={this.props.trace} />
      </div>
    );
  },

  getDepth(span) {
    let maxDepth = 1;

    span.get('childSpans').forEach(childSpan => {
      maxDepth = Math.max(maxDepth, this.getDepth(childSpan) + 1);
    });

    return maxDepth;
  },

  getCalls(span) {
    let calls = 1;

    span.get('childSpans').forEach(childSpan => {
      calls += this.getCalls(childSpan);
    });

    return calls;
  }
}));
