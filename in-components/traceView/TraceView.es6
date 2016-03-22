import React from 'react';

import TraceTable from 'in-components/traceView/TraceTable';
import TraceDetails from 'in-components/traceView/TraceDetails';

import './TraceView.less';

const block = 'in-trace-view';

export default React.createClass({
  displayName: 'TraceView',

  render() {
    return (
      <section className={block}>
        <h1>Trace View</h1>
        <TraceTable />
        <TraceDetails />
      </section>
    );
  }
});
