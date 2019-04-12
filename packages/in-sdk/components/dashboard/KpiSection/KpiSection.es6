import React from 'react';

import locals from './KpiSection.mless';

const block = locals.kpiSection;

export function KpiHeading({ children }) {
  return <div className={block + '__heading'}>{children}</div>;
}

export function KpiKeyValue({ label, children }) {
  return (
    <div className={block + '__kv'}>
      <span className={block + '__key'}>{label}</span>
      <span className={block + '__value'}>{children}</span>
    </div>
  );
}

export function KpiSection({ children }) {
  return (
    <div className={block} title="Summary">
      {children}
    </div>
  );
}
