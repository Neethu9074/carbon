import React from 'react';

import {zeroDecimalPlaces} from 'in-services/formatters/number';
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
        ({zeroDecimalPlaces(count)})
      </span>
    );
  }
);
