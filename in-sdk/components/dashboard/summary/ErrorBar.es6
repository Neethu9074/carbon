import React from 'react';

import { percentage } from 'in-services/formatters/number';

import './ErrorBar.less';

const block = 'in-dashboard-error-bar';

export default function Errorbar({ value }) {
  if (value == null || value < 0) {
    return null;
  }
  const width = `${Math.min(100, value * 100)}%`;

  return (
    <div className={block}>
      <div className={`${block}__bar`}>
        <div className={`${block}__fill`} style={{ width }} />
      </div>

      <span className={`${block}__value`}>{percentage.compact(value)} Errors</span>
    </div>
  );
}
