import React from 'react';

import locals from './PercentageCell.mless';

const block = locals.percentageCell;
const levelElement = `${block}__level`;
const valueElement = `${block}__value`;

export default function PercentageCell({ value, content }) {
  let width = '0px';
  if (value != null) {
    // if value grows larger than 100% (e.g. for cpu) prevent overflow
    width = `${Math.round(Math.min(1, value) * 100)}%`;
  }
  return (
    <div className={block}>
      <div className={levelElement} style={{ width }} />
      <span className={valueElement}>{content}</span>
    </div>
  );
}
