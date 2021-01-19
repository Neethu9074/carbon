/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { millis } from 'in-services/formatters/number';
import locals from './HorizontalAxis.mless';

export default function HorizontalAxis({ buckets, bucketWidth, bucketCenter }) {
  return (
    <div className={locals.horizontalAxis} style={{ width: bucketWidth * buckets.length }}>
      {buckets.map((bucket, i) =>
        bucket.tickMark !== true ? null : (
          <Tick
            key={bucket.from || 0}
            bucket={bucket}
            bucketPosition={bucketWidth * i}
            bucketWidth={bucketWidth}
            bucketCenter={bucketCenter}
          />
        )
      )}
    </div>
  );
}

function Tick({ bucket, bucketPosition, bucketWidth, bucketCenter }) {
  const formatTime = millis.forcedCompactOnMs.detailed;
  let label;
  if (bucket.from == null || bucket.from === 0) {
    label = '< ' + formatTime(bucket.to);
  } else if (bucket.to == null) {
    label = '> ' + formatTime(bucket.from);
  } else {
    label = formatTime(bucket.from);
  }
  return (
    <div className={locals.tickContainer} style={{ width: bucketWidth + 'px', left: bucketPosition + 'px' }}>
      <div className={locals.tick} style={{ left: bucketCenter }} />
      <div className={locals.tickValues}>{label}</div>
    </div>
  );
}
