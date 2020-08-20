import PropTypes from 'prop-types';
import React from 'react';

import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { clearActiveTooltip } from 'in-services/stores/tooltip';
import { propTypeTimeConfig } from 'in-stores/time/config';
import Overlay from 'in-new-components/overlays/Overlay';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';
import Link from 'in-components/Link';

import locals from './SingleIconLaneItem.mless';

export default function SingleIconLaneItem({
  xPos,
  iconConfig,
  onClick,
  onHover,
  getHref$,
  showIconForCluster,
  eventData,
  calloutContent,
  timeConfig
}) {
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
      <Overlay props={{ iconConfig, eventData, timeConfig }} content={calloutContent}>
        {({ open, refSetter }) => {
          const icon = (
            <SvgIcon
              size="xs"
              className={locals.icon}
              onClick={
                !calloutContent && !onClick
                  ? undefined
                  : e => {
                      stopPropagationAndPreventDefault(e);
                      if (calloutContent) open();
                      onClick?.(eventData);
                      clearActiveTooltip();
                    }
              }
              type={showIconForCluster ? iconConfig.typeCluster : iconConfig.type}
              color={iconConfig.color}
              refSetter={refSetter}
            />
          );
          if (getHref$) {
            return <Link href$={getHref$(eventData)}>{icon}</Link>;
          }
          return icon;
        }}
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
  timeConfig: propTypeTimeConfig,
  getHref$: PropTypes.func
};
