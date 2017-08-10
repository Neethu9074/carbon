import React from 'react';

import './Kpis.less';

const block = 'in-dash-sum-kpis';

export default function Kpis({ children }) {
  return (
    <div className={block}>
      {children}
    </div>
  );
}
