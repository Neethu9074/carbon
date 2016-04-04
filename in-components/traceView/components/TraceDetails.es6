import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import TraceWaterfallChart from 'in-components/traceView/components/TraceWaterfallChart';
import TraceHeading from 'in-components/traceView/components/TraceHeading';
import TabHeader from 'in-components/traceView/components/TabHeader';
import {msZeroDecimalPlaces} from 'in-services/formatters/number';
import {formatDateTime} from 'in-services/formatters/date';
import {selectedTrace} from 'in-stores/traces';
import connectTo from 'in-hoc/connectTo';

import './TraceDetails.less';

const block = 'in-trace-details';

export default connectTo({
  trace: selectedTrace
}, React.createClass({
  displayName: 'TraceDetails',

  mixins: [PureRenderMixin],

  propTypes: {
    trace: irpt.map
  },

  render() {
    if (!this.props.trace) {
      return <p>No trace selected.</p>;
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
