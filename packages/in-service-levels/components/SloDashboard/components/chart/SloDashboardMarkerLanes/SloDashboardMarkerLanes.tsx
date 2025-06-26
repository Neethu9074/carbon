/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { isApplicationSloEntity, isSyntheticSloEntity, isWebsiteSloEntity, SloEntityUnion } from '@instana/types';

import ApplicationSloMarkerLanes from 'in-service-levels/components/SloDashboard/components/chart/SloDashboardMarkerLanes/ApplicationSloMarkerLanes';
import SyntheticSloMarkerLanes from 'in-service-levels/components/SloDashboard/components/chart/SloDashboardMarkerLanes/SyntheticSloMarkerLanes';
import WebsiteSloMarkerLanes from 'in-service-levels/components/SloDashboard/components/chart/SloDashboardMarkerLanes/WebsiteSloMarkerLanes';
import { AdditionChartContentProps } from 'in-components/Chart/types';

export interface SloDashboardMarkerLanesProps extends AdditionChartContentProps {
  entity: SloEntityUnion;
  hideCorrectionWindowsLane?: boolean;
}

export default function SloDashboardMarkerLanes({
  entity,
  hideCorrectionWindowsLane,
  ...props
}: SloDashboardMarkerLanesProps) {
  if (isApplicationSloEntity(entity)) {
    return (
      <ApplicationSloMarkerLanes hideCorrectionWindowsLane={hideCorrectionWindowsLane} entity={entity} {...props} />
    );
  }

  if (isWebsiteSloEntity(entity)) {
    return <WebsiteSloMarkerLanes hideCorrectionWindowsLane={hideCorrectionWindowsLane} entity={entity} {...props} />;
  }

  if (isSyntheticSloEntity(entity)) {
    return <SyntheticSloMarkerLanes hideCorrectionWindowsLane={hideCorrectionWindowsLane} {...props} />;
  }

  return null;
}
