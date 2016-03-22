import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import TraceWaterfallChart from 'in-components/traceView/TraceWaterfallChart';
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
      return null;
    }
    return (
      <div className={block}>
        <h1>TraceDetails</h1>
        <TraceWaterfallChart trace={this.props.trace} />
      </div>
    );
  }
}));
