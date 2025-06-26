/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { ApplicationSloEntity } from '@instana/types';

import type { SloDashboardMarkerLanesProps } from 'in-service-levels/components/SloDashboard/components/chart/SloDashboardMarkerLanes/SloDashboardMarkerLanes';
// @ts-expect-error -- Typescript migration is already in progress
import ReleasesLane from 'in-components/Chart/markerLanes/ReleasesLane/ReleasesLane';
// @ts-expect-error -- Typescript migration is already in progress
import AlertsLane from 'in-components/Chart/markerLanes/AlertsLane/AlertsLane';
import CorrectionWindowsLane from 'in-service-levels/components/SloDashboard/components/chart/SloDashboardMarkerLanes/CorrectionWindowsLane';
import getApplicationAlertClusters from 'in-applications/subscriptions/getApplicationAlertClusters';
import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';

interface ApplicationSloMarkerLanesProps extends Omit<SloDashboardMarkerLanesProps, 'configuration'> {
  entity: ApplicationSloEntity;
}

export default function ApplicationSloMarkerLanes({
  granularity,
  timeConfig,
  entity,
  chartContentPosition,
  chartWidth = 0,
  chartHeight = 0,
  chartBucketWidth = 0,
  timeAxisHeight = 0,
  markerPaneHeight = 0,
  hideCorrectionWindowsLane
}: ApplicationSloMarkerLanesProps) {
  const { applicationId, serviceId, endpointId } = entity;

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
      <ReleasesLane applicationId={applicationId} serviceId={serviceId} />
      <AlertsLane getAlerts={getApplicationAlertClusters} config={{ applicationId, serviceId, endpointId }} />
      {!hideCorrectionWindowsLane && <CorrectionWindowsLane chartContentPosition={chartContentPosition} />}
    </MarkerLanesPresenter>
  );
}
