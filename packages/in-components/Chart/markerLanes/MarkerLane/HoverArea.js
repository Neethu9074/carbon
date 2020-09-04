import PropTypes from 'prop-types';
import React from 'react';

import locals from './HoverArea.mless';

export default function HoverArea({
  xPos,
  fromXPos,
  toXPos,
  clusterWidth,
  color,
  chartContentPosition,
  timeAxisHeight,
  markerPaneHeight,
  renderLine = true,
  chartHeight
}) {
  return (
    <>
      <div
        className={locals.highlightClusterOverlayWrapper}
        style={{
          transform: `translateX(${fromXPos !== undefined ? fromXPos : xPos - clusterWidth / 2}px)`,
          width: `${toXPos !== undefined && fromXPos !== undefined ? toXPos - fromXPos + 0.5 : clusterWidth}px`,
          color,
          height: getClusterOverlayHeight(),
          ...getClusterOverlayTopAndBottomOffset()
        }}
      >
        <div
          style={{
            color
          }}
          className={locals.highlightClusterOverlay}
        />
      </div>
      {renderLine && (
        <div
          className={locals.line}
          style={{
            transform: `translateX(${Math.max(Math.min(xPos, toXPos - 1), fromXPos)}px)`,
            color,
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
  color: PropTypes.string,
  markerPaneHeight: PropTypes.number,
  timeAxisHeight: PropTypes.number,
  xPos: PropTypes.number,
  fromXPos: PropTypes.number,
  renderLine: PropTypes.bool,
  toXPos: PropTypes.number
};
