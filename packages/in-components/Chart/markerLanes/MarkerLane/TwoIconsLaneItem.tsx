/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef, Ref } from 'react';

import { AlertClusterResponse, TimeConfig } from '@instana/types';

import { LaneItemProps, MarkerLaneEvent } from 'in-components/Chart/markerLanes/MarkerLane/MarkerLane';
import SingleMarkerLaneItem from 'in-components/Chart/markerLanes/MarkerLane/SingleMarkerLaneItem';
import { ChartContentPostition } from 'in-components/Chart/types';
import { ScaleType } from 'in-services/scale';
import { Nullish } from 'in-types';

interface IconConfig {
  color: string;
  type: string;
  typeCluster: string;
}

interface CalloutContentProps {
  iconConfig: IconConfig;
  eventData: AlertClusterResponse;
  timeConfig: TimeConfig;
}

export interface MarkerItemProps<EventType extends MarkerLaneEvent> {
  eventData: EventType;
  showIconForCluster?: boolean;
  chartContentPosition: ChartContentPostition;
  isClustered?: boolean;
  xScale: ScaleType | Nullish;
}

interface TwoIconsLaneItemProps<EventType extends MarkerLaneEvent> extends LaneItemProps<EventType> {
  renderMarkerItem: React.JSXElementConstructor<MarkerItemProps<EventType>>;
  iconConfigForMultipleAlertTypes: {
    incidents: IconConfig;
    smartAlerts: IconConfig;
  };
  calloutContent: React.ComponentType<CalloutContentProps>;
}

const TwoIconsLaneItem = forwardRef(function TwoIconsLaneItem<EventType extends MarkerLaneEvent>(
  { iconConfigForMultipleAlertTypes, eventData, ...remainingProps }: TwoIconsLaneItemProps<EventType>,
  ref: Ref<HTMLDivElement>
) {
  const clusterSections = Object.keys(iconConfigForMultipleAlertTypes);
  const alertTypeConfig0 =
    iconConfigForMultipleAlertTypes[clusterSections[0] as keyof typeof iconConfigForMultipleAlertTypes];
  const alertTypeConfig1 =
    iconConfigForMultipleAlertTypes[clusterSections[1] as keyof typeof iconConfigForMultipleAlertTypes];
  return <SingleMarkerLaneItem ref={ref} {...remainingProps} {...getIconRenderState()} eventData={eventData} />;

  function getIconRenderState() {
    const alertTypeZeroHasItems = eventData
      ? (eventData[clusterSections[0] as keyof typeof eventData] as [])?.length
      : 0;
    const alertTypeOneHasItems = eventData
      ? (eventData[clusterSections[1] as keyof typeof eventData] as [])?.length
      : 0;

    let showIconForCluster = false;
    let iconConfig;

    if (alertTypeZeroHasItems && alertTypeOneHasItems) {
      iconConfig = alertTypeConfig0;
      showIconForCluster = true;
    } else if (alertTypeZeroHasItems) {
      if (alertTypeZeroHasItems > 1) showIconForCluster = true;
      iconConfig = alertTypeConfig0;
    } else if (alertTypeOneHasItems) {
      if (alertTypeOneHasItems > 1) showIconForCluster = true;
      iconConfig = alertTypeConfig1;
    }

    return { showIconForCluster, iconConfig };
  }
});
export default TwoIconsLaneItem;
