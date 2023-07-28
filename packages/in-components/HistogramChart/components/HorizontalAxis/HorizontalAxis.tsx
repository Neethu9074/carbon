/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { HorizontalAxisProps } from 'in-components/HistogramChart/components/HorizontalAxis/types';
import Tick from 'in-components/HistogramChart/components/HorizontalAxis/Tick';

import locals from 'in-components/HistogramChart/components/HorizontalAxis/HorizontalAxis.mless';

export default function HorizontalAxis(props: HorizontalAxisProps) {
  const { buckets, bucketWidth, min } = props;

  return (
    <div className={locals.horizontalAxis} style={{ width: bucketWidth * buckets.length }}>
      {buckets.map((bucket, index) => (
        <Tick
          key={`${bucket.from}_${bucket.to}_${index}`}
          bucket={bucket}
          bucketPosition={bucketWidth * index}
          bucketWidth={bucketWidth}
          min={min}
          isTickVisible={bucket.tickMark}
        />
      ))}
    </div>
  );
}
