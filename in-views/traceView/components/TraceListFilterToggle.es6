import React from 'react';

import {typeFilter$} from 'in-views/traceView/stores/filters';
import connectTo from 'in-hoc/connectTo';

import './TraceListFilterToggle.less';

const block = 'in-trace-view-filter-toggle';

export default connectTo({
  typeFilter: typeFilter$
}, function TraceListFilterToggle({typeFilter, children, filter, onClick}) {
  let className = block;
  if (typeFilter === filter) {
    className += ` ${block}--selected`;
  }

  return (
    <div className={className}
         onClick={onClick}>
      {children}
    </div>
  );
});
