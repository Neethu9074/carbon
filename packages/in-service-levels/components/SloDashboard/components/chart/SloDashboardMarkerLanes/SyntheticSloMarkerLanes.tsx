/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import type { SloDashboardMarkerLanesProps } from 'in-service-levels/components/SloDashboard/components/chart/SloDashboardMarkerLanes/SloDashboardMarkerLanes';
import CorrectionWindowsLane from 'in-service-levels/components/SloDashboard/components/chart/SloDashboardMarkerLanes/CorrectionWindowsLane';
import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';

type SyntheticSloMarkerLanesProps = Omit<SloDashboardMarkerLanesProps, 'configuration' | 'entity'>;

export default function SyntheticSloMarkerLanes({
  granularity,
  timeConfig,
  chartContentPosition,
  chartWidth = 0,
  chartHeight = 0,
  chartBucketWidth = 0,
  timeAxisHeight = 0,
  markerPaneHeight = 0
}: SyntheticSloMarkerLanesProps) {
  return (
    <MarkerLanesPresenter
      granularity={granularity}
      timeConfig={timeConfig}
      chartWidth={chartWidth}
      chartHeight={chartHeight}
      chartBucketWidth={chartBucketWidth}
      chartContentPosition={chartContentPosition}
      timeAxisHeight={timeAxisHeight}
      markerPaneHeight={markerPaneHeight}
    >
      <CorrectionWindowsLane chartContentPosition={chartContentPosition} />
    </MarkerLanesPresenter>
  );
}
