import PropTypes from 'prop-types';
import React from 'react';

import locals from './HoverArea.mless';

export default function HoverArea({
  xPos,
  clusterWidth,
  color,
  chartContentPosition,
  timeAxisHeight,
  markerPaneHeight,
  chartHeight
}) {
  return (
    <>
      <div
        className={locals.highlightClusterOverlayWrapper}
        style={{
          transform: `translateX(${xPos - clusterWidth / 2}px)`,
          width: `${clusterWidth}px`,
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
      <div
        className={locals.line}
        style={{
          transform: `translateX(${xPos}px)`,
          color,
          ...getLineTopAndBottomOffset()
        }}
      />
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
    if (chartContentPosition === 'post') return { top: chartHeight, bottom: 8 };
  }
}

HoverArea.propTypes = {
  chartContentPosition: PropTypes.string,
  chartHeight: PropTypes.number,
  clusterWidth: PropTypes.number,
  color: PropTypes.string,
  markerPaneHeight: PropTypes.number,
  timeAxisHeight: PropTypes.number,
  xPos: PropTypes.number
};
