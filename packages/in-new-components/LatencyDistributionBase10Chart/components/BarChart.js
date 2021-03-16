/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import locals from './BarChart.mless';

export default function BarChart({ buckets, config, bucketWidth, maxCallCount, height, style }) {
  if (config.isFiltered('y1', 0)) {
    return null;
  }
  return (
    <div className={locals.wrapperContainer} style={{ ...style, height: height }}>
      {buckets.map((bucket, i) => {
        const bucketPosition = bucketWidth * i;
        let barHeight = Math.floor((bucket.calls / maxCallCount) * height);
        if (bucket.calls > 0) {
          barHeight = Math.max(2, barHeight);
        }
        return (
          <div
            key={bucket.from || 0}
            className={locals.bucket}
            style={{ width: bucketWidth + 'px', height: height + 'px', left: bucketPosition + 'px' }}
          >
            <Bar height={barHeight} bucketWidth={bucketWidth} color={config.y1.colors100[0]} />
          </div>
        );
      })}
    </div>
  );
}

function Bar({ height, bucketWidth, color }) {
  // use smaller gap if buckets are very narrow
  const gap = bucketWidth > 5 ? 2 : 1;
  const barWidth = bucketWidth - gap;
  return (
    <div
      style={{
        height: height + 'px',
        width: barWidth + 'px',
        backgroundColor: color
      }}
      className={locals.bar}
    />
  );
}
