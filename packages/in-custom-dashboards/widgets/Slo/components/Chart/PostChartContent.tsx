/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import SliCreationMarkerLane from 'in-custom-dashboards/widgets/Slo/components/Chart/SliCreationMarkerLane';
import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import { SliConfig } from 'in-custom-dashboards/widgets/Slo/sli/sliTypes';
import { AdditionChartContentProps } from 'in-components/Chart/types';

interface PostChartContentProps extends AdditionChartContentProps {
  sliConfig?: SliConfig;
}

export default function PostChartContent({
  sliConfig,
  timeConfig,
  chartBucketWidth = 0,
  chartWidth = 0,
  chartContentPosition,
  granularity,
  timeAxisHeight,
  markerPaneHeight
}: PostChartContentProps) {
  if (!sliConfig) return null;

  return (
    <MarkerLanesPresenter
      chartWidth={chartWidth}
      chartBucketWidth={chartBucketWidth}
      timeConfig={timeConfig}
      granularity={granularity}
      timeAxisHeight={timeAxisHeight}
      markerPaneHeight={markerPaneHeight}
    >
      <SliCreationMarkerLane sliConfig={sliConfig} chartContentPosition={chartContentPosition} />
    </MarkerLanesPresenter>
  );
}
