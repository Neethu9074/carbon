import PropTypes from 'prop-types';
import React from 'react';

import { commonOverlayStylesPropType } from 'in-components/Chart/markerLanes/MarkerLane/MarkerLane';

import locals from './HoverLine.mless';

export default function HoverLine({
  xPos,
  chartContentPosition,
  timeAxisHeight,
  markerPaneHeight,
  commonOverlayStyles
}) {
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
  }
}

HoverLine.propTypes = {
  chartContentPosition: PropTypes.string,
  markerPaneHeight: PropTypes.number,
  timeAxisHeight: PropTypes.number,
  xPos: PropTypes.number,
  ...commonOverlayStylesPropType
};
