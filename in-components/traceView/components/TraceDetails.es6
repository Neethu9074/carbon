import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import TraceWaterfallChart from 'in-components/traceView/components/TraceWaterfallChart';
import TraceHeading from 'in-components/traceView/components/TraceHeading';
import {selectedTrace} from 'in-stores/traces';
import connectTo from 'in-hoc/connectTo';

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
        <TraceHeading>
          {this.props.trace.get('name')}
        </TraceHeading>
        <TraceWaterfallChart trace={this.props.trace} />
      </div>
    );
  }
}));
