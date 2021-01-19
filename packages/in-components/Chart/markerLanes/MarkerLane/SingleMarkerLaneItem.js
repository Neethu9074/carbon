/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { forwardRef } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import locals from './SingleMarkerLaneItem.mless';

const SingleMarkerLaneItem = forwardRef(function SingleMarkerLaneItem(
  { xPos, onHover, eventData, renderMarkerItem: MarkerItem, hideDefaultHoverStyle, ...remainingProps },
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
        onHover?.(eventData);
      }}
      onMouseLeave={() => {
        onHover?.(null);
      }}
    >
      <MarkerItem {...remainingProps} eventData={eventData} />
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
