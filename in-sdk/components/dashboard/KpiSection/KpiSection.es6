import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Button from 'in-components/Button';

import './KpiSection.less';

const block = 'in-kpi-section';

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


export function KpiSection({children}) {
  return (
    <DashboardSection className={block}
                      title='Summary'>
      {children}
    </DashboardSection>
  );
}


export function KpiTopLevelInteraction({onClick, children}) {
  return (
    <Button onClick={onClick}
            className={`${block}__top-level-interaction`}>
      {children}
    </Button>
  );
}
