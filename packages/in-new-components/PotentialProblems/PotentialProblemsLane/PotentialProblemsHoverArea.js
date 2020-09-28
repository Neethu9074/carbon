import PropTypes from 'prop-types';
import React from 'react';

import locals from './PotentialProblemsHoverArea.mless';

export default function PotentialProblemsHoverArea({
  xPos,
  chartContentPosition,
  timeAxisHeight,
  markerPaneHeight,
  xScale,
  eventData
}) {
  const height = 8; // it's the same value as the --item-heigh var in the respective CSS file
  const { duration } = eventData;
  let durationWidth = duration ? xScale?.getRangeArea(duration) : null;
  if (!durationWidth) return null;
  if (durationWidth < height) durationWidth = height;

  const fromXPos = Math.max(0, xPos);
  const toXPos = Math.min(xPos + durationWidth, xScale?.getRangeTo());

  return (
    <div
      className={locals.highlightClusterOverlay}
      style={{
        transform: `translateX(${fromXPos !== undefined ? fromXPos : xPos - durationWidth / 2}px)`,
        width: `${toXPos !== undefined && fromXPos !== undefined ? toXPos - fromXPos + 0.5 : durationWidth}px`,
        ...getTopAndBottomOffset()
      }}
    />
  );

  function getTopAndBottomOffset() {
    if (chartContentPosition === 'pre') return { bottom: timeAxisHeight, top: 24 };
    if (chartContentPosition === 'post') return { bottom: 16, top: markerPaneHeight };
  }
}

PotentialProblemsHoverArea.propTypes = {
  chartContentPosition: PropTypes.string,
  eventData: PropTypes.object,
  markerPaneHeight: PropTypes.number,
  timeAxisHeight: PropTypes.number,
  xPos: PropTypes.number,
  xScale: PropTypes.shape({
    getRangeArea: PropTypes.func,
    getRangeTo: PropTypes.func
  })
};
