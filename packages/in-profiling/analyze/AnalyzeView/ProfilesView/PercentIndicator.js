/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import locals from './PercentIndicator.mless';

export default function PercentIndicator({ percent }) {
  // the percentage is given with high accurancy. Cap to 2 decimal places therefore
  const percentLabel = ((percent * 100) | 0) / 100;

  return (
    <>
      <div className={locals.percentWrapper}>
        <div className={locals.percent} style={{ width: percent }} />
      </div>
      <span className={locals.percentLabel}>{percentLabel}%</span>
    </>
  );
}
