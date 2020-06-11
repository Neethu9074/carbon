import React from 'react';

import locals from './HorizontalAxis.mless';

export default function HorizontalAxis({ buckets, bucketWidth, width, formatter }) {
  return (
    <div className={locals.horizontalAxis} style={{ minWidth: width }}>
      {buckets.map((bucket, i) => (
        <Tick
          index={i}
          bucket={bucket}
          bucketWidth={bucketWidth}
          formatter={formatter}
          enabled={bucket.tickMark === true}
        />
      ))}
    </div>
  );
}

function Tick({ bucket, bucketWidth, index, formatter, enabled }) {
  let value;
  if (bucket.from && bucket.to) {
    value = formatter.detailed(bucket.from);
  } else if (bucket.from) {
    value = '> ' + formatter.detailed(bucket.from);
  } else {
    value = '< ' + formatter.detailed(bucket.to);
  }

  return (
    <div key={index} className={locals.tickContainer} style={{ width: bucketWidth }}>
      {enabled && (
        <>
          <div className={locals.tick} />
          <div className={locals.tickValues}>{value}</div>
        </>
      )}
    </div>
  );
}
