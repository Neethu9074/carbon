import React from 'react';

import TraceTable from './TraceTable';

import './TraceView.less';

const block = 'in-trace-view';

export default React.createClass({
  displayName: 'TraceView',

  render() {
    return (
      <section className={block}>
        Trace View

        <TraceTable />
      </section>
    );
  }
});
