/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import locals from './PercentileMarkers.mless';

export default function PercentileMarkers({
  percentileBuckets,
  bucketWidth,
  bucketCenter,
  chartHeight,
  percentilesShown
}) {
  function percentileMarkerOverflow(bucketWidth, bucketFromSide) {
    const ratio = bucketFromSide + 0.5;
    return `(max(50%, ${bucketWidth * ratio}px) - ${bucketWidth * ratio}px)`;
  }
  return (
    <div className={locals.wrapperContainer}>
      {percentileBuckets.map((percentileBucket, i) => {
        const percentiles = percentileBucket.map(p => p.percentile).filter(p => percentilesShown.includes(p));

        let percentileOffset;
        // Center the percentile marker by moving it 50% to the left (50% means half the width of the percentile marker).
        // Additionally, move the markers on the first/last two buckets if the bucket width is smaller than the width of
        // percentile markers.
        if (i === 0) {
          percentileOffset = `calc(-50% + ${percentileMarkerOverflow(bucketWidth, 0)})`;
        } else if (i === 1) {
          percentileOffset = `calc(-50% + ${percentileMarkerOverflow(bucketWidth, 1)})`;
        } else if (i === percentileBuckets.length - 2) {
          percentileOffset = `calc(-50% - ${percentileMarkerOverflow(bucketWidth, 1)})`;
        } else if (i === percentileBuckets.length - 1) {
          percentileOffset = `calc(-50% - ${percentileMarkerOverflow(bucketWidth, 0)})`;
        } else {
          percentileOffset = `-50%`;
        }

        if (percentiles.length > 0) {
          return (
            <PercentileMarker
              key={i}
              percentiles={percentiles}
              position={bucketWidth * i + bucketCenter}
              height={chartHeight}
              percentileStyle={{ transform: `translateX(${percentileOffset})` }}
            />
          );
        }
        return null;
      })}
    </div>
  );
}

function PercentileMarker({ percentiles, position, height, percentileStyle }) {
  if (!percentiles || percentiles.length === 0) {
    return null;
  }
  const highestPercentile = percentiles.sort()[percentiles.length - 1];
  const label = percentiles.length > 1 ? 'p' + highestPercentile + '…' : 'p' + highestPercentile;
  return (
    <>
      <div className={locals.dottedLine} style={{ left: position + 'px', height: height + 'px' }} />
      <div className={locals.percentiles} style={{ left: position + 'px', ...percentileStyle }}>
        {label}
      </div>
    </>
  );
}
