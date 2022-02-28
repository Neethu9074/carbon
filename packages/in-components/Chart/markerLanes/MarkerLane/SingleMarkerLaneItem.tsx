/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef } from 'react';
import classNames from 'classnames';

import { LaneItemProps, MarkerLaneEvent } from 'in-components/Chart/markerLanes/MarkerLane/MarkerLane';
import { ChartContentPostition } from 'in-components/Chart/types';
import { ScaleType } from 'in-services/scale';
import { Nullish } from 'in-types';

import locals from './SingleMarkerLaneItem.mless';

export interface MarkerItemProps {
  eventData: MarkerLaneEvent;
  showIconForCluster?: boolean;
  chartContentPosition: ChartContentPostition;
  isClustered?: boolean;
  xScale: ScaleType | Nullish;
}

interface SingleMarkerLaneItemProps extends LaneItemProps {
  renderMarkerItem: React.JSXElementConstructor<MarkerItemProps>;
  hideDefaultHoverStyle?: boolean;
}

const SingleMarkerLaneItem = forwardRef<HTMLDivElement, SingleMarkerLaneItemProps>(function SingleMarkerLaneItem(
  {
    xPos,
    onHover,
    eventData,
    renderMarkerItem: MarkerItem,
    hideDefaultHoverStyle,
    ...remainingProps
  }: SingleMarkerLaneItemProps,
  ref
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
});

export default SingleMarkerLaneItem;
