import PropTypes from 'prop-types';
import React from 'react';

import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';

import locals from './LaneItem.mless';

export default function LaneItem({ xPos, iconConfig, onClick, onHover, containsMoreThenOneItem, timestamp }) {
  return (
    <div
      style={{ transform: `translateX(${xPos}px)` }}
      className={locals.laneItem}
      onMouseEnter={e => {
        stopPropagationAndPreventDefault(e);
        onHover?.({
          isHovered: true,
          startTime: timestamp
        });
      }}
      onMouseLeave={e => {
        stopPropagationAndPreventDefault(e);
        onHover?.({});
      }}
    >
      <SvgIcon
        size="xs"
        className={locals.marker}
        onClick={onClick}
        type={containsMoreThenOneItem ? iconConfig.typeCluster : iconConfig.type}
        color={iconConfig.color}
      />
    </div>
  );
}

LaneItem.propTypes = {
  containsMoreThenOneItem: PropTypes.bool,
  iconConfig: PropTypes.shape({
    type: PropTypes.string.isRequired,
    typeCluster: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired
  }),
  onClick: PropTypes.func,
  onHover: PropTypes.func,
  timestamp: PropTypes.number,
  xPos: PropTypes.number
};
