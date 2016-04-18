import React from 'react';

import {totalTraceCount$} from 'in-stores/traces';
import connectTo from 'in-hoc/connectTo';

import './TotalTraceCount.less';

export default connectTo(
  {
    count: totalTraceCount$
  },
  function TotalTraceCount({count}) {
    if (count == null) {
      return <noscript/>;
    }

    return (
      <span className='in-total-trace-count'>
        ({count})
      </span>
    );
  }
);
