/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { clearActiveTooltip } from 'in-components/Tooltip/store';
import { propTypeTimeConfig } from 'in-stores/time/config';
import Overlay from 'in-new-components/overlays/Overlay';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';

import locals from './LaneIcon.mless';

export default function LaneIcon({ timeConfig, calloutContent, onClick, eventData, showIconForCluster, iconConfig }) {
  return (
    <Overlay props={{ iconConfig, eventData, timeConfig }} content={calloutContent} withoutWrapper>
      {({ open, ref }) => {
        return (
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
            ref={ref}
          />
        );
      }}
    </Overlay>
  );
}

LaneIcon.propTypes = {
  calloutContent: PropTypes.func,
  eventData: PropTypes.object.isRequired,
  iconConfig: PropTypes.shape({
    color: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    typeCluster: PropTypes.string.isRequired
  }),
  onClick: PropTypes.func,
  showIconForCluster: PropTypes.bool,
  timeConfig: propTypeTimeConfig
};
