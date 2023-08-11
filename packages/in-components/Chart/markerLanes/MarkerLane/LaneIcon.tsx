/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { MutableRefObject } from 'react';

import { SvgIcon } from '@instana/components';

import { OverlayContentProps, OverlayMounterContentProps } from 'in-components/overlays/Overlay/types';
import { MarkerLaneEvent } from 'in-components/Chart/markerLanes/MarkerLane/MarkerLane';
import { clearActiveTooltip } from 'in-components/Tooltip/store';
import Overlay from 'in-components/overlays/Overlay';
import { TimeConfig } from 'in-types';

import locals from './LaneIcon.mless';

interface IconConfig {
  type: string;
  typeCluster: string;
  color: string;
}

interface ForwardedOverlayContentProps<EventType extends MarkerLaneEvent> {
  timeConfig?: TimeConfig;
  eventData: EventType;
  iconConfig: IconConfig;
}

interface LaneIconProps<EventType extends MarkerLaneEvent> {
  timeConfig?: TimeConfig;
  calloutContent?: React.ComponentType<
    OverlayContentProps & OverlayMounterContentProps & ForwardedOverlayContentProps<EventType>
  >;
  onClick?: (e: EventType) => void;
  eventData: EventType;
  showIconForCluster?: boolean;
  iconConfig: IconConfig;
}

export default function LaneIcon<EventType extends MarkerLaneEvent>({
  timeConfig,
  calloutContent,
  onClick,
  eventData,
  showIconForCluster,
  iconConfig
}: LaneIconProps<EventType>) {
  return (
    <Overlay
      props={{ iconConfig, eventData, timeConfig }}
      // Casting calloutContent here, because the overlay will not be opened if the content is not present.
      // However, properly avoiding rendering of the Overlay if the calloutContent is not present is too complicated in this case
      content={calloutContent!}
      withoutWrapper
    >
      {({ open, ref }) => {
        return (
          <SvgIcon
            size="xs"
            className={locals.icon}
            onClick={
              !calloutContent && !onClick
                ? undefined
                : () => {
                    if (calloutContent) open();
                    onClick?.(eventData);
                    clearActiveTooltip();
                  }
            }
            type={showIconForCluster ? iconConfig.typeCluster : iconConfig?.type}
            color={iconConfig?.color}
            ref={ref as MutableRefObject<SVGSVGElement> | undefined}
          />
        );
      }}
    </Overlay>
  );
}
