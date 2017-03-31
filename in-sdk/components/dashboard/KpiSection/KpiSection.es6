import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';

import './KpiSection.less';

const block = 'in-kpi-section';

export function KpiHeading({ children }) {
  return (
    <div className={block + '__heading'}>
      {children}
    </div>
  );
}

export function KpiKeyValue({ label, children }) {
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

export function KpiSection({ children }) {
  return (
    <DashboardSection className={block} title="Summary">
      {children}
    </DashboardSection>
  );
}
