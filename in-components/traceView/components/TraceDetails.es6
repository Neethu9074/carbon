import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import TraceWaterfallChart from 'in-components/traceView/components/TraceWaterfallChart';
import TraceHeading from 'in-components/traceView/components/TraceHeading';
import TabHeader from 'in-components/traceView/components/TabHeader';
import {msZeroDecimalPlaces} from 'in-services/formatters/number';
import LoadingIndicator from 'in-components/LoadingIndicator';
import {formatDateTime} from 'in-services/formatters/date';
import {selectedTrace, selectedTraceId} from 'in-stores/traces';
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
        <TabHeader left={<TraceHeading>{this.props.trace.get('name')}</TraceHeading>} />

        <dl className={block + '__props'}>
          <dt className={block + '__prop-key'}>Start</dt>
          <dd className={block + '__prop-value'}>
            {formatDateTime(this.props.trace.get('start'))}
          </dd>

          <dt className={block + '__prop-key'}>Duration</dt>
          <dd className={block + '__prop-value'}>
            {msZeroDecimalPlaces(this.props.trace.get('duration'))}
          </dd>

          <dt className={block + '__prop-key'}>Depth</dt>
          <dd className={block + '__prop-value'}>
            {this.getDepth(this.props.trace)}
          </dd>

          <dt className={block + '__prop-key'}>Calls</dt>
          <dd className={block + '__prop-value'}>
            {this.getCalls(this.props.trace)}
          </dd>
        </dl>

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
