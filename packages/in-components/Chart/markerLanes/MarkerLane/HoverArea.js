/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import React from 'react';

import { commonOverlayStylesPropType } from 'in-components/Chart/markerLanes/MarkerLane/MarkerLane';

import locals from './HoverArea.mless';

export default function HoverArea({
  xPos,
  fromXPos,
  toXPos,
  clusterWidth,
  chartContentPosition,
  timeAxisHeight,
  markerPaneHeight,
  renderLine = true,
  chartHeight,
  commonOverlayStyles
}) {
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
  }

  function getClusterOverlayTopAndBottomOffset() {
    if (chartContentPosition === 'pre') return { bottom: timeAxisHeight };
    if (chartContentPosition === 'post') return { top: markerPaneHeight };
  }

  function getLineTopAndBottomOffset() {
    if (chartContentPosition === 'pre') return { bottom: chartHeight, top: 8 };
    if (chartContentPosition === 'post') return { top: chartHeight, bottom: 0 };
  }
}

HoverArea.propTypes = {
  chartContentPosition: PropTypes.string,
  chartHeight: PropTypes.number,
  clusterWidth: PropTypes.number,
  markerPaneHeight: PropTypes.number,
  timeAxisHeight: PropTypes.number,
  xPos: PropTypes.number,
  fromXPos: PropTypes.number,
  renderLine: PropTypes.bool,
  toXPos: PropTypes.number,
  commonOverlayStyles: commonOverlayStylesPropType
};
