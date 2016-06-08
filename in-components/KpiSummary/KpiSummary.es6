import React from 'react';

import './KpiSummary.less';

const block = 'in-kpi-summary';

export function KpiHeading({children}) {
  return (
    <div className={block + '__heading'}>
      {children}
    </div>
  );
}


export function KpiKeyValue({label, children}) {
  return (
    <div className={block + '__kv'}>
      <span className={block + '__key'}>
        {label}
      </span>
      <span className={block + '__value'}>
        {children}
      </span>
    </div>
  );
}


export function KpiSummary({children}) {
  return (
    <div className={block}>
      {children}
    </div>
  );
}
