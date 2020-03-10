import React from 'react';

import { millis } from 'in-services/formatters/number';

import locals from './HorizontalAxis.mless';

export default function HorizontalAxis({ buckets, width }) {
  return (
    <div className={locals.horizontalAxis} style={{ minWidth: width }}>
      {buckets.map((bucket, i) => (
        <Tick key={i} bucket={bucket} buckets={buckets} />
      ))}
    </div>
  );
}

function Tick({ bucket, buckets, i }) {
  const from = millis.forcedCompactOnMs.detailed(bucket.from);
  const to = millis.forcedCompactOnMs.detailed(bucket.to);

  return (
    <div
      key={i}
      className={locals.tickContainer}
      style={{
        width: `calc((100% / ${buckets.length}) - 2%)`
      }}
    >
      <div className={locals.tick} />
      <div className={locals.tickValues}>{from}</div>
      <div className={locals.tickValues}>{to}</div>
    </div>
  );
}
