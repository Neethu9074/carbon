/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ForwardedRef, forwardRef, Ref } from 'react';
import classNames from 'classnames';

import { LaneItemProps, MarkerLaneEvent } from 'in-components/Chart/markerLanes/MarkerLane/MarkerLane';
import { ChartContentPostition } from 'in-components/Chart/types';
import { ScaleType } from 'in-services/scale';
import { Nullish } from 'in-types';

import locals from './SingleMarkerLaneItem.mless';

export interface MarkerItemProps<EventType extends MarkerLaneEvent> {
  eventData: EventType;
  showIconForCluster?: boolean;
  chartContentPosition: ChartContentPostition;
  isClustered?: boolean;
  xScale: ScaleType | Nullish;
}

interface SingleMarkerLaneItemProps<EventType extends MarkerLaneEvent> extends LaneItemProps<EventType> {
  renderMarkerItem: React.JSXElementConstructor<MarkerItemProps<EventType>>;
  hideDefaultHoverStyle?: boolean;
}

const SingleMarkerLaneItem = forwardRef(function SingleMarkerLaneItem<EventType extends MarkerLaneEvent>(
  {
    xPos,
    onHover,
    eventData,
    renderMarkerItem: MarkerItem,
    hideDefaultHoverStyle,
    ...remainingProps
  }: SingleMarkerLaneItemProps<EventType>,
  ref: ForwardedRef<HTMLDivElement>
) {
  return (
    <div
      ref={ref}
      style={{ transform: `translateX(${xPos}px)` }}
      className={classNames({
        [locals.laneItem]: true,
        [locals.hideHoverEffect]: hideDefaultHoverStyle
      })}
      onMouseEnter={() => {
        onHover?.(eventData);
      }}
      onMouseLeave={() => {
        onHover?.(null);
      }}
    >
      <MarkerItem {...remainingProps} eventData={eventData} />
    </div>
  );
  // Cast forwardRef result to keep generic signature
}) as <EventType extends MarkerLaneEvent>(
  props: SingleMarkerLaneItemProps<EventType> & { ref?: Ref<HTMLDivElement> }
) => React.ReactElement;

export default SingleMarkerLaneItem;
