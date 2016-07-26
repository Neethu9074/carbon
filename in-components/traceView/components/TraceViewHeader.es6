import React from 'react';

import './TraceViewHeader.less';

const block = 'in-trace-view-header';

export default function TraceViewHeader({children, className = ''}) {
  return (
    <div className={`${block} ${className}`}>
      {children}
    </div>
  );
}
