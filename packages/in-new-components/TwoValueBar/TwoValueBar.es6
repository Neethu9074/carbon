import React from 'react';

import locals from './TwoValueBar.mless';

export default function TwoValueBar({ v1, v2, v1Label, v2Label, renderLabels = true, formatter, fullDomain }) {
  if (v1 == null || v1 < 0) {
    return null;
  }
  fullDomain = fullDomain || v1 + v2;
  const v1BarWidth = v1 == null ? '0%' : `${((v1 / fullDomain) * 100) | 0}%`;

  return (
    <div className={locals.wrapper}>
      <div className={locals.bar}>
        <div className={locals.fill} style={{ width: v1BarWidth }} />
      </div>

      {renderLabels && (
        <div className={locals.values}>
          <span className={locals.value1}>
            {v1 != null ? formatter(v1) : '––'} {v1Label}
          </span>
          <span className={locals.value2}>
            {v2Label} {v1 != null ? formatter(v2) : '––'}
          </span>
        </div>
      )}
    </div>
  );
}
