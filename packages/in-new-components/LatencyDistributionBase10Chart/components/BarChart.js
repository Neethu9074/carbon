import { pickBy } from 'lodash';
import React from 'react';

import locals from './BarChart.mless';

export default function BarChart({
  buckets,
  percentileBuckets,
  bucketWidth,
  bucketCenter,
  maxCallCount,
  chartHeight,
  percentileHeight,
  percentilesShown
}) {
  const barMaxHeight = chartHeight - percentileHeight - 1;
  return (
    <div>
      {buckets.map((bucket, idx) => {
        const percentiles = pickBy(percentileBuckets[idx], (value, key) => percentilesShown.includes(parseInt(key)));
        const bucketPosition = bucketWidth * idx;
        let barHeight = Math.floor((bucket.calls / maxCallCount) * barMaxHeight);
        if (bucket.calls > 0) {
          barHeight = Math.max(2, barHeight);
        }
        return (
          <div
            key={bucket.from || 0}
            className={locals.bucket}
            style={{ width: bucketWidth + 'px', height: chartHeight + 'px', left: bucketPosition + 'px' }}
          >
            <Bar height={barHeight} bucketWidth={bucketWidth} />
            <PercentileMarker percentiles={Object.keys(percentiles)} position={bucketCenter} barHeight={barHeight} />
          </div>
        );
      })}
    </div>
  );
}

function Bar({ height, bucketWidth }) {
  // use smaller gap if buckets are very narrow
  const gap = bucketWidth > 5 ? 2 : 1;
  const barWidth = bucketWidth - gap;
  return (
    <div
      style={{
        height: height + 'px',
        width: barWidth + 'px'
      }}
      className={locals.bar}
    />
  );
}

function PercentileMarker({ percentiles, position, barHeight }) {
  if (!percentiles || percentiles.length === 0) {
    return null;
  }
  const highestPercentile = percentiles.sort()[percentiles.length - 1];
  const label = percentiles.length > 1 ? 'p' + highestPercentile + '…' : 'p' + highestPercentile;
  return (
    <>
      <div className={locals.dottedLine} style={{ left: position + 'px', bottom: barHeight + 1 + 'px' }} />
      <div className={locals.percentiles}>{label}</div>
    </>
  );
}
