/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SvgIcon } from '@instana/components';

import { getIcon, getColorForEventAtFocusedMomentAsStream } from 'in-stores/events';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';
import theme from 'in-themes';

export default connectTo(
  props => {
    if (props.disableColorCalculation) {
      return {};
    }
    return {
      color: getColorForEventAtFocusedMomentAsStream(props.event, { defaultColor: theme.lib.colors.N700Medium })
    };
  },
  function EventIcon({ className, event, tooltipLabel, color, size }) {
    return (
      <Tooltip content={tooltipLabel} align="rightMiddle">
        <SvgIcon color={color || '#40535b'} className={className} type={getIcon({ event })} size={size || 's'} />
      </Tooltip>
    );
  }
);
