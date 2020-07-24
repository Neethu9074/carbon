import React from 'react';

import locals from './PercentileMarkers.mless';

export default function PercentileMarkers({
  percentileBuckets,
  bucketWidth,
  bucketCenter,
  chartHeight,
  percentilesShown
}) {
  return (
    <div className={locals.wrapperContainer}>
      {percentileBuckets.map((percentileBucket, i) => {
        const percentiles = percentileBucket.map(p => p.percentile).filter(p => percentilesShown.includes(p));
        if (percentiles.length > 0) {
          return <PercentileMarker key={i} percentiles={percentiles} position={bucketWidth * i + bucketCenter} height={chartHeight} />;
        }
        return null;
      })}
    </div>
  );
}

function PercentileMarker({ percentiles, position, height }) {
  if (!percentiles || percentiles.length === 0) {
    return null;
  }
  const highestPercentile = percentiles.sort()[percentiles.length - 1];
  const label = percentiles.length > 1 ? 'p' + highestPercentile + '…' : 'p' + highestPercentile;
  return (
    <>
      <div className={locals.dottedLine} style={{ left: position + 'px', height: height + 'px' }} />
      <div className={locals.percentiles} style={{ left: position + 'px'}}>{label}</div>
    </>
  );
}
