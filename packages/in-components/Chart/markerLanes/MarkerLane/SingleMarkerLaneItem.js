import PropTypes from 'prop-types';
import React from 'react';

import { stopPropagationAndPreventDefault } from 'in-services/util/function';

import locals from './SingleMarkerLaneItem.mless';

export default function SingleMarkerLaneItem({ xPos, onHover, eventData, renderMarkerItem, ...remainingProps }) {
  return (
    <div
      style={{ transform: `translateX(${xPos}px)` }}
      className={locals.laneItem}
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
  renderMarkerItem: PropTypes.func.isRequired,
  eventData: PropTypes.object.isRequired,
  onHover: PropTypes.func,
  xPos: PropTypes.number
};
