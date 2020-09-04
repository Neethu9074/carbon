import PropTypes from 'prop-types';
import React from 'react';

import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import evaluateClassNames from 'in-services/util/classnames';

import locals from './SingleMarkerLaneItem.mless';

export default function SingleMarkerLaneItem({
  xPos,
  onHover,
  eventData,
  renderMarkerItem,
  hideDefaultHoverStyle,
  ...remainingProps
}) {
  return (
    <div
      style={{ transform: `translateX(${xPos}px)` }}
      className={evaluateClassNames({
        [locals.laneItem]: true,
        [locals.hideHoverEffect]: hideDefaultHoverStyle
      })}
      onMouseEnter={e => {
        stopPropagationAndPreventDefault(e);
        onHover?.(eventData);
      }}
      onMouseLeave={e => {
        stopPropagationAndPreventDefault(e);
        onHover?.(null);
      }}
    >
      {renderMarkerItem({ ...remainingProps, eventData })}
    </div>
  );
}

SingleMarkerLaneItem.propTypes = {
  eventData: PropTypes.object.isRequired,
  hideDefaultHoverStyle: PropTypes.bool,
  onHover: PropTypes.func,
  renderMarkerItem: PropTypes.func.isRequired,
  xPos: PropTypes.number
};
