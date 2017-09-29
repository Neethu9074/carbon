import React from 'react';

import './DualValueBar.less';

const block = 'in-dashboard-dual-value-bar';

export default function DualValueBar({ aValue, bValue, aLabel, bLabel, formatter }) {
  if (aValue == null || aValue < 0) {
    return null;
  }
  const fullDomain = aValue + bValue;
  const aBarWidth = aValue == null ? '0%' : `${(aValue / fullDomain * 100) | 0}%`;

  return (
    <div className={block}>
      <div className={`${block}__bar`}>
        <div className={`${block}__fill`} style={{ width: aBarWidth }} />
      </div>

      <span className={`${block}__a`}>
        {aValue != null ? formatter(aValue) : '––'} {aLabel}
      </span>
      <span className={`${block}__b`}>
        {bLabel} {aValue != null ? formatter(bValue) : '––'}
      </span>
    </div>
  );
}
