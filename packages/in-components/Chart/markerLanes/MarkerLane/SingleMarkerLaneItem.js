import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import locals from './SingleMarkerLaneItem.mless';

const SingleMarkerLaneItem = forwardRef(function SingleMarkerLaneItem(
  { xPos, onHover, eventData, renderMarkerItem, hideDefaultHoverStyle, ...remainingProps },
  ref
) {
  return (
    <div
      ref={ref}
      style={{ transform: `translateX(${xPos}px)` }}
      className={classNames({
        [locals.laneItem]: true,
        [locals.hideHoverEffect]: hideDefaultHoverStyle
      })}
      onMouseEnter={() => {
        // TODO
        // stopPropagationAndPreventDefault(e);
        onHover?.(eventData);
      }}
      onMouseLeave={() => {
        // TODO
        // stopPropagationAndPreventDefault(e);
        onHover?.(null);
      }}
    >
      {renderMarkerItem({ ...remainingProps, eventData })}
    </div>
  );
});

export default SingleMarkerLaneItem;

SingleMarkerLaneItem.propTypes = {
  eventData: PropTypes.object.isRequired,
  hideDefaultHoverStyle: PropTypes.bool,
  onHover: PropTypes.func,
  renderMarkerItem: PropTypes.func.isRequired,
  xPos: PropTypes.number
};
