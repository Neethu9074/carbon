import PropTypes from 'prop-types';
import React from 'react';

import { eventDataPropType } from 'in-components/Chart/markerLanes/PotentialProblemsLane/constants';

import locals from './PotentialProblemsHoverArea.mless';

export default function PotentialProblemsHoverArea({
  xPos,
  chartContentPosition,
  timeAxisHeight,
  markerPaneHeight,
  xScale,
  eventData
}) {
  const { duration } = eventData;
  const durationWidth = duration ? xScale?.getRangeArea(duration) : null;

  const fromXPos = Math.max(0, xPos - durationWidth / 2);
  const toXPos = Math.min(xPos + durationWidth / 2, xScale?.getRangeTo());

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
  eventData: eventDataPropType,
  markerPaneHeight: PropTypes.number,
  timeAxisHeight: PropTypes.number,
  xPos: PropTypes.number,
  xScale: PropTypes.shape({
    getRangeArea: PropTypes.func,
    getRangeTo: PropTypes.func
  })
};
