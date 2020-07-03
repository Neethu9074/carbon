import React from 'react';

import locals from './HorizontalAxis.mless';

export default function HorizontalAxis({ buckets, bucketWidth, width, formatter }) {
  return (
    <div className={locals.horizontalAxis} style={{ minWidth: width }}>
      {buckets.map((bucket, i) => (
        <Tick
          key={i}
          bucket={bucket}
          bucketWidth={bucketWidth}
          formatter={formatter}
          enabled={bucket.tickMark === true}
        />
      ))}
    </div>
  );
}

function Tick({ bucket, bucketWidth, formatter, enabled }) {
  let value;
  if (bucket.from !== 0 && bucket.to !== 0) {
    value = formatter.detailed(bucket.from);
  } else if (bucket.from !== 0) {
    value = '> ' + formatter.detailed(bucket.from);
  } else {
    value = '< ' + formatter.detailed(bucket.to);
  }

  return (
    <div className={locals.tickContainer} style={{ width: bucketWidth }}>
      {enabled && (
        <>
          <div className={locals.tick} />
          <div className={locals.tickValues}>{value}</div>
        </>
      )}
    </div>
  );
}
