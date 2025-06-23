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
}

export default function SloDashboardMarkerLanes({ entity, ...props }: SloDashboardMarkerLanesProps) {
  if (isApplicationSloEntity(entity)) {
    return <ApplicationSloMarkerLanes entity={entity} {...props} />;
  }

  if (isWebsiteSloEntity(entity)) {
    return <WebsiteSloMarkerLanes entity={entity} {...props} />;
  }

  if (isSyntheticSloEntity(entity)) {
    return <SyntheticSloMarkerLanes {...props} />;
  }

  return null;
}
