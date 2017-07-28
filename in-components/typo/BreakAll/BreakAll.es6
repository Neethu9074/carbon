import React from 'react';

import './BreakAll.less';

export default function BreakAll({ children }) {
  return (
    <span className="in-break-all">
      {children}
    </span>
  );
}
