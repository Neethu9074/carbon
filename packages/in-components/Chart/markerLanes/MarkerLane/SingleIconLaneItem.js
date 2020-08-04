import PropTypes from 'prop-types';
import React from 'react';

import { propTypeTimeConfig } from 'in-stores/time/config';
import Overlay from 'in-new-components/overlays/Overlay';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';

import locals from './SingleIconLaneItem.mless';

export default function SingleIconLaneItem({
  xPos,
  iconConfig,
  onClick,
  onHover,
  showIconForCluster,
  eventData,
  calloutContent,
  timeConfig
}) {
  return (
    <div
      style={{ transform: `translateX(${xPos}px)` }}
      className={locals.laneItem}
      onMouseEnter={() => {
        onHover?.({
          isHovered: true,
          eventData,
          iconConfig
        });
      }}
      onMouseLeave={() => {
        onHover?.({});
      }}
    >
      <Overlay props={{ iconConfig, eventData, timeConfig }} content={calloutContent} autoOpen={false} withoutWrapper>
        {({ toggle, refSetter }) => (
          <SvgIcon
            size="xs"
            className={locals.marker}
            onClick={
              !calloutContent && !onclick
                ? undefined
                : () => {
                    if (calloutContent) toggle();
                    onClick?.();
                  }
            }
            type={showIconForCluster ? iconConfig.typeCluster : iconConfig.type}
            color={iconConfig.color}
            refSetter={refSetter}
          />
        )}
      </Overlay>
    </div>
  );
}

SingleIconLaneItem.propTypes = {
  showIconForCluster: PropTypes.bool,
  iconConfig: PropTypes.shape({
    type: PropTypes.string.isRequired,
    typeCluster: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired
  }),
  eventData: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  onHover: PropTypes.func,
  xPos: PropTypes.number,
  calloutContent: PropTypes.func,
  timeConfig: propTypeTimeConfig
};
