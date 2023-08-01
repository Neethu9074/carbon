/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { TickProps } from 'in-components/HistogramChart/components/HorizontalAxis/types';

import locals from 'in-components/HistogramChart/components/HorizontalAxis/Tick.mless';

export default function Tick(props: TickProps) {
  const { bucket, bucketPosition, bucketWidth, isTickVisible } = props;

  let label = bucket.from;

  if (bucket.from === null) {
    label = '< ' + bucket.to;
  } else if (bucket.to === null) {
    label = '> ' + bucket.from;
  }

  return (
    <div className={locals.tickContainer} style={{ width: bucketWidth + 'px', left: bucketPosition + 'px' }}>
      <div className={isTickVisible ? locals.tick : locals.tickHidden} />
      {isTickVisible && <div className={locals.tickValues}>{label}</div>}
    </div>
  );
}
