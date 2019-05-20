import React from 'react';

import locals from './PercentageCell.mless';

export default function PercentageCell({ value, content }) {
  let width = '0px';
  if (value != null) {
    // if value grows larger than 100% (e.g. for cpu) prevent overflow
    width = `${Math.round(Math.min(1, value) * 100)}%`;
  }
  return (
    <div className={locals.percentageCell}>
      <div className={locals.percentageCellLevel} style={{ width }} />
      <span className={locals.percentageCellValue}>{content}</span>
    </div>
  );
}
