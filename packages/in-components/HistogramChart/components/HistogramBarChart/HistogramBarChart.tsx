/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import HistogramBar from 'in-components/HistogramChart/components/HistogramBarChart/HistogramBar';
import { Bucket } from 'in-components/HistogramChart/components/HistogramChartPresenter/types';
import Config from 'in-components/Chart/Configuration';
import { Axis } from 'in-components/Chart/types';

import locals from './HistogramBarChart.mless';

interface HistogramBarChartConfigProps extends Config {
  data: Bucket[];
  y1: Axis;
}

interface HistogramBarChartProps {
  buckets: Bucket[];
  bucketWidth: number;
  maxCallCount: number;
  height: number;
  config: HistogramBarChartConfigProps;
  style: React.CSSProperties;
}

export default function HistogramBarChart({
  buckets,
  config,
  bucketWidth,
  maxCallCount,
  height,
  style
}: HistogramBarChartProps) {
  if (config.isFiltered('y1', 0)) {
    return null;
  }

  return (
    <div className={locals.wrapperContainer} style={{ ...style, height: height }}>
      {buckets.map((bucket: Bucket, i: number) => {
        const bucketPosition = bucketWidth * i;

        let barHeight = Math.floor((bucket.calls / maxCallCount) * height);

        if (bucket.calls > 0) {
          barHeight = Math.max(2, barHeight);
        }

        return (
          <div
            key={`${bucket.from}_${bucket.to}_${i}`}
            className={locals.bucket}
            style={{ width: bucketWidth + 'px', height: height + 'px', left: bucketPosition + 'px' }}
          >
            <HistogramBar height={barHeight} bucketWidth={bucketWidth} color={config.y1.colors100[0]} />
          </div>
        );
      })}
    </div>
  );
}
