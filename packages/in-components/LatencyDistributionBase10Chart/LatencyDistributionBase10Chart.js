/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import LatencyDistributionBase10ChartPresenter from 'in-components/LatencyDistributionBase10Chart/LatencyDistributionBase10ChartPresenter';
import useResizeObserverCustom from 'in-hooks/useResizeObserver';

export default function LatencyDistributionBase10Chart({ cheight = 189, cwidth, ...remainingProps }) {
  const { ref, ...dimensions } = useResizeObserverCustom();
  return (
    <div ref={ref}>
      <LatencyDistributionBase10ChartPresenter
        {...remainingProps}
        {...dimensions}
        customWidth={cwidth}
        customHeight={cheight}
      />
    </div>
  );
}
