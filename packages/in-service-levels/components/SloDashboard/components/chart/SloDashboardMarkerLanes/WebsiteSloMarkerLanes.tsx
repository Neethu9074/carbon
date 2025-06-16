/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { WebsiteSloEntity } from '@instana/types';

import type { SloDashboardMarkerLanesProps } from 'in-service-levels/components/SloDashboard/components/chart/SloDashboardMarkerLanes/SloDashboardMarkerLanes';
// @ts-expect-error -- Ts migration already in progress
import ReleasesLane from 'in-components/Chart/markerLanes/ReleasesLane/ReleasesLane';
import CorrectionWindowsLane from 'in-service-levels/components/SloDashboard/components/chart/SloDashboardMarkerLanes/CorrectionWindowsLane';
// @ts-expect-error -- Ts migration already in progress
import AlertsLane from 'in-components/Chart/markerLanes/AlertsLane/AlertsLane';
import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import getWebsiteAlertClusters from 'in-websites/subscriptions/getWebsiteAlertClusters';

interface WebsiteSloMarkerLanesProps extends Omit<SloDashboardMarkerLanesProps, 'configuration'> {
  entity: WebsiteSloEntity;
}

export default function WebsiteSloMarkerLanes({
  granularity,
  timeConfig,
  entity,
  chartContentPosition,
  chartWidth = 0,
  chartBucketWidth = 0,
  chartHeight = 0,
  timeAxisHeight = 0,
  markerPaneHeight = 0
}: WebsiteSloMarkerLanesProps) {
  const { websiteId } = entity;

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
      <ReleasesLane />
      <AlertsLane
        config={{
          websiteId
        }}
        getAlerts={getWebsiteAlertClusters}
      />
      <CorrectionWindowsLane chartContentPosition={chartContentPosition} />
    </MarkerLanesPresenter>
  );
}
