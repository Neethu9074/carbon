import React from 'react';

import './TraceViewHeader.less';

const block = 'in-trace-view-header';

export default function TraceViewHeader({children}) {
  return (
    <div className={block}>
      {children}
    </div>
  );
}
