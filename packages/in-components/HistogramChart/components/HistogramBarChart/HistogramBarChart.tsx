/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import HistogramBar from 'in-components/HistogramChart/components/HistogramBarChart/HistogramBar';
import { Bucket } from 'in-components/HistogramChart/components/HistogramChartPresenter/types';
import { ChartableDataSeries } from 'in-components/AnalyzeView/StateManagement';
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
  maxValue: number;
  height: number;
  config: HistogramBarChartConfigProps;
  style: React.CSSProperties;
  chartableDataSeries?: ChartableDataSeries;
  isGrouped?: boolean;
}

export default function HistogramBarChart({
  buckets,
  config,
  bucketWidth,
  maxValue,
  height,
  style,
  chartableDataSeries,
  isGrouped
}: HistogramBarChartProps) {
  if (config.isFiltered('y1', 0)) {
    return null;
  }
  return (
    <div className={locals.wrapperContainer} style={{ ...style, height: height }}>
      {buckets?.map((bucket: Bucket | Bucket[], i: number) => {
        const bucketPosition = bucketWidth * i;
        let totalCalls = 0;
        if (Array.isArray(bucket)) {
          totalCalls = bucket.reduce((sum: number, a: Bucket) => a.calls + sum, 0);
        } else {
          totalCalls = bucket.calls;
        }
        let barHeight = !Array.isArray(bucket) ? Math.floor((bucket.calls / maxValue) * height) : height;
        if (totalCalls > 0) {
          barHeight = Math.max(2, barHeight);
        }

        return (
          <div
            key={i}
            className={Array.isArray(bucket) ? locals.stackedBar : locals.bucket}
            style={{ width: bucketWidth + 'px', height: height + 'px', left: bucketPosition + 'px' }}
          >
            <HistogramBar
              height={barHeight}
              bucketWidth={bucketWidth}
              buckets={bucket}
              color={config.y1.colors100[0]}
              chartableDataSeries={chartableDataSeries}
              maxValue={maxValue}
              isGrouped={isGrouped}
            />
          </div>
        );
      })}
    </div>
  );
}
