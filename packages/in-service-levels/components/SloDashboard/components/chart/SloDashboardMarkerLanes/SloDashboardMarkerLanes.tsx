/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { isApplicationSloEntity, isWebsiteSloEntity, ServiceLevelObjectiveConfiguration } from '@instana/types';

import ApplicationSloMarkerLanes from 'in-service-levels/components/SloDashboard/components/chart/SloDashboardMarkerLanes/ApplicationSloMarkerLanes';
import WebsiteSloMarkerLanes from 'in-service-levels/components/SloDashboard/components/chart/SloDashboardMarkerLanes/WebsiteSloMarkerLanes';
import { AdditionChartContentProps } from 'in-components/Chart/types';

export interface SloDashboardMarkerLanesProps extends AdditionChartContentProps {
  configuration: ServiceLevelObjectiveConfiguration;
}

export default function SloDashboardMarkerLanes({ configuration, ...props }: SloDashboardMarkerLanesProps) {
  if (isApplicationSloEntity(configuration.entity)) {
    return <ApplicationSloMarkerLanes entity={configuration.entity} {...props} />;
  }

  if (isWebsiteSloEntity(configuration.entity)) {
    return <WebsiteSloMarkerLanes entity={configuration.entity} {...props} />;
  }

  return null;
}
