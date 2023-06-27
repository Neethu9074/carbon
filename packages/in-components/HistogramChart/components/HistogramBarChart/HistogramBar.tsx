/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import locals from './HistogramBarChart.mless';

interface BarProps {
  height: number;
  bucketWidth: number;
  color: string;
}

export default function HistogramBar({ height, bucketWidth, color }: BarProps) {
  const gap = bucketWidth > 5 ? 2 : 1; // use smaller gap if buckets are very narrow
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
