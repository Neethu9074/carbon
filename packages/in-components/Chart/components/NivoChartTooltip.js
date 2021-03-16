/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import locals from './NivoChartTooltip.mless';

export default function NivoChartTooltip({ id, aggregation, value, color, formatter }) {
  return (
    <div className={locals.wrapper}>
      <div className={locals.labelWrapper}>
        <div style={{ background: color }} className={locals.dot} />
        {id}
        {aggregation && <span className={locals.aggregation}>{`(${aggregation})`}</span>}
      </div>
      <span className={locals.value}>{formatter.detailed(value)}</span>
    </div>
  );
}
