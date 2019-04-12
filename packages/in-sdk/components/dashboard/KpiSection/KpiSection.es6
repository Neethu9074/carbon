import React from 'react';

import locals from './KpiSection.mless';

export function KpiHeading({ children }) {
  return <div className={locals.kpiHeading}>{children}</div>;
}

export function KpiKeyValue({ label, children }) {
  return (
    <div className={locals.kpiKV}>
      <span className={locals.key}>{label}</span>
      <span className={locals.value}>{children}</span>
    </div>
  );
}

export function KpiSection({ children }) {
  return (
    <div className={locals.kpiSection} title="Summary">
      {children}
    </div>
  );
}
