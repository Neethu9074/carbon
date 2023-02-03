/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { MarkerLaneHoverOverlayConfig } from 'in-components/Chart/markerLanes/MarkerLane/MarkerLane';

import locals from './HoverLine.mless';

export default function HoverLine({
  xPos,
  chartContentPosition,
  timeAxisHeight,
  markerPaneHeight,
  commonOverlayStyles
}: MarkerLaneHoverOverlayConfig) {
  return (
    <div
      className={locals.hoverLine}
      style={{
        transform: `translateX(${xPos}px)`,
        ...commonOverlayStyles,
        ...getTopAndBottomOffset()
      }}
    />
  );

  function getTopAndBottomOffset() {
    if (chartContentPosition === 'pre') return { bottom: timeAxisHeight, top: 8 };
    if (chartContentPosition === 'post') return { bottom: 0, top: markerPaneHeight };
    return undefined as never;
  }
}
