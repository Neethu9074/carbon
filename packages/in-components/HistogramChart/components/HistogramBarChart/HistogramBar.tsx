/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Bucket } from 'in-components/HistogramChart/components/HistogramChartPresenter/types';
import { ChartableDataSeries } from 'in-components/AnalyzeView/StateManagement';

import locals from './HistogramBarChart.mless';

interface BarProps {
  height: number;
  bucketWidth: number;
  color: string;
  buckets?: Bucket | Bucket[];
  chartableDataSeries?: ChartableDataSeries;
  isGrouped?: boolean;
  maxValue?: number;
}

export default function HistogramBar({
  height,
  bucketWidth,
  color,
  buckets,
  chartableDataSeries,
  isGrouped,
  maxValue
}: BarProps) {
  const gap = bucketWidth > 5 ? 2 : 1; // use smaller gap if buckets are very narrow
  const barWidth = bucketWidth - gap;

  const getBackgroundColor = (bucket: Bucket) => {
    if (chartableDataSeries) {
      return (
        chartableDataSeries?.find(data => bucket?.group === data.label)?.color || `var(--ids-color-option-neutral-600)`
      );
    } else {
      return `var(--ids-color-option-neutral-300)`;
    }
  };
  return (
    <>
      {Array.isArray(buckets) ? (
        buckets
          .filter((bucket: Bucket) => bucket.calls)
          .map((bucket: Bucket, idx: number) => {
            let barHeight = maxValue ? Math.max(2, Math.floor((bucket.calls / maxValue) * height)) : 0;
            return (
              <div
                key={`${bucket.group && bucket.from ? bucket.group + bucket.from : idx}`}
                style={{
                  height: barHeight + 'px',
                  width: barWidth + 'px',
                  backgroundColor: getBackgroundColor(bucket),
                  marginBottom: idx > 0 ? '1px' : 0
                }}
              />
            );
          })
      ) : (
        <div
          style={{
            height: height + 'px',
            width: barWidth + 'px',
            backgroundColor: isGrouped ? `var(--ids-color-option-neutral-300)` : color
          }}
          className={locals.bar}
        />
      )}
    </>
  );
}
