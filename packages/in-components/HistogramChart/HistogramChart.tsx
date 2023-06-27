/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

// @ts-expect-error
import HistogramChartPresenter from 'in-components/HistogramChart/components/HistogramChartPresenter/HistogramChartPresenter';
import useResizeObserverCustom from 'in-hooks/useResizeObserver';
import { ChartProps } from 'in-components/HistogramChart/types';

export default function HistogramChart({ height = 200, width, ...remainingProps }: ChartProps) {
  const { ref, ...dimensions } = useResizeObserverCustom();

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>}>
      <HistogramChartPresenter {...remainingProps} {...dimensions} customWidth={width} customHeight={height} />
    </div>
  );
}
