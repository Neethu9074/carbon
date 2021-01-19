/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { updateCanvasDimensions } from 'in-components/Chart/canvas';
import line from 'in-components/Chart/renderer/line';
import React, { useEffect, useRef } from 'react';

import locals from './LineChart.mless';

export default function LineChart({ metricBuckets, config, bucketWidth, maxCallCount, height, width, style }) {
  const canvas = useRef(null);

  // Canvas needs to have some additional space on top, because the line chart
  // may sometimes draw above the designated chart area, e.g, spikes.
  const canvasHeight = height + 10;

  let metrics = metricBuckets
    .map((buckets, i) => {
      return (
        !config.isFiltered('y1', i) && {
          dataSeries: toDataPoints(buckets),
          color: config.y1.colors100[i]
        }
      );
    })
    .filter(Boolean);

  if (config.y1.reverseOrder) {
    metrics = metrics.reverse();
  }

  useEffect(() => {
    const context = canvas.current.getContext('2d');
    // scale the canvas pixels to match the CSS pixels
    updateCanvasDimensions(canvas.current, context, width, canvasHeight);
    metrics.forEach(metric => {
      const { dataSeries, color } = metric;
      render(dataSeries, color, context, bucketWidth);
    });
  });

  return <canvas className={locals.canvas} ref={canvas} style={{ ...style, height: canvasHeight }} />;

  /** Converts an array of latency buckets to an array of x- and y-coordinates. */
  function toDataPoints(buckets) {
    return buckets.map((bucket, i) => {
      const x = bucketWidth * i + Math.ceil(bucketWidth / 2);
      let dataPointHeight = Math.floor((bucket.calls / maxCallCount) * height);
      if (bucket.calls > 0) {
        dataPointHeight = Math.max(1, dataPointHeight);
      }
      if (bucket.calls === 0) {
        // draw in invisible area to hide the 0 calls buckets
        dataPointHeight = -10;
      }
      const y = canvasHeight - dataPointHeight;
      return [x, y];
    });
  }
}

// export for tests
export function render(dataSeries, color, context, bucketWidth) {
  line.render({
    // array of x- and y-coordinates
    dataSeries: dataSeries,
    color: color,
    scale: {
      // converts the second data point's parameter to a y-coordinate
      getRange: y => y
    },
    config: {
      backBufferCtx: context,
      y1: {
        lineWidth: 2
      },
      xScaleBackBuffer: {
        // converts the first data point's parameter to a x-coordinate
        getRange: x => x
      },
      // max distance between data points in px when a point will be drawn instead of a line
      maxDistanceBetweenDatapointsInMillis: 3 * bucketWidth
    }
  });
}
