/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { MarkerLaneHoverOverlayConfig } from 'in-components/Chart/markerLanes/MarkerLane/MarkerLane';

import locals from './HoverArea.mless';

interface HoverAreaProps extends MarkerLaneHoverOverlayConfig {
  renderLine?: boolean;
}
export default function HoverArea({
  xPos = 0,
  fromXPos,
  toXPos,
  clusterWidth,
  chartContentPosition,
  timeAxisHeight = 0,
  markerPaneHeight = 0,
  renderLine = true,
  chartHeight = 0,
  commonOverlayStyles
}: HoverAreaProps) {
  return (
    <>
      <div
        className={locals.highlightClusterOverlayWrapper}
        style={{
          transform: `translateX(${fromXPos !== undefined ? fromXPos : xPos - clusterWidth / 2}px)`,
          width: `${toXPos !== undefined && fromXPos !== undefined ? toXPos - fromXPos + 0.5 : clusterWidth}px`,
          height: getClusterOverlayHeight(),
          ...commonOverlayStyles,
          ...getClusterOverlayTopAndBottomOffset()
        }}
      >
        <div
          style={{
            color: commonOverlayStyles.color
          }}
          className={locals.highlightClusterOverlay}
        />
      </div>
      {renderLine && (
        <div
          className={locals.line}
          style={{
            transform: `translateX(${Math.max(Math.min(xPos, toXPos - 1), fromXPos)}px)`,
            color: commonOverlayStyles.color,
            ...getLineTopAndBottomOffset()
          }}
        />
      )}
    </>
  );

  function getClusterOverlayHeight() {
    if (chartContentPosition === 'pre') return chartHeight - timeAxisHeight;
    if (chartContentPosition === 'post') return chartHeight - markerPaneHeight;
    return undefined as never;
  }

  function getClusterOverlayTopAndBottomOffset() {
    if (chartContentPosition === 'pre') return { bottom: timeAxisHeight };
    if (chartContentPosition === 'post') return { top: markerPaneHeight };
    return undefined as never;
  }

  function getLineTopAndBottomOffset() {
    if (chartContentPosition === 'pre') return { bottom: chartHeight, top: 8 };
    if (chartContentPosition === 'post') return { top: chartHeight, bottom: 0 };
    return undefined as never;
  }
}
