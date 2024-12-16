/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import SliCreationMarkerLane from 'in-custom-dashboards/widgets/SloLegacy/components/ChartMarkerLanes/SliCreationMarkerLane';
import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import { AdditionChartContentProps } from 'in-components/Chart/types';

interface ChartMarkerLanesProps extends AdditionChartContentProps {
  initialEvaluationTimestamp?: number;
  tooltipContent: React.ReactNode;
}

export default function ChartMarkerLanes({
  timeConfig,
  chartBucketWidth = 0,
  chartWidth = 0,
  chartContentPosition,
  granularity,
  timeAxisHeight,
  markerPaneHeight,
  initialEvaluationTimestamp,
  tooltipContent,
  ...props
}: ChartMarkerLanesProps) {
  if (!initialEvaluationTimestamp) return null;

  return (
    <MarkerLanesPresenter
      chartWidth={chartWidth}
      chartBucketWidth={chartBucketWidth}
      timeConfig={timeConfig}
      granularity={granularity}
      timeAxisHeight={timeAxisHeight}
      markerPaneHeight={markerPaneHeight}
      chartContentPosition={chartContentPosition}
    >
      <SliCreationMarkerLane
        chartBucketWidth={chartBucketWidth}
        tooltipContent={tooltipContent}
        initialEvaluationTimestamp={initialEvaluationTimestamp}
        {...props}
      />
    </MarkerLanesPresenter>
  );
}
