import React from 'react';

import './Metric.less';

const block = 'in-cockpit-metric';

export default function Metric({ label, children }) {
  return (
    <div className={block}>
      <div className={`${block}__key`}>
        {label}
      </div>
      <div className={`${block}__value`}>
        {children}
      </div>
    </div>
  );
}
