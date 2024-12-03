/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { themes } from '@instana/design-tokens';
import { SvgIcon } from '@instana/components';

import { getIcon, getColorForEventAtFocusedMomentAsStream, getEventType } from 'in-stores/events';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    if (props.disableColorCalculation) {
      return {};
    }
    return {
      color: getColorForEventAtFocusedMomentAsStream(props.event, {
        defaultColor: themes.default.ids.color.option.neutral['700']
      })
    };
  },
  function EventIcon({ className, event, tooltipLabel, color, size }) {
    const eventType = getEventType(event);
    return (
      <Tooltip content={tooltipLabel} align="rightMiddle">
        <SvgIcon color={color || '#40535b'} className={className} type={getIcon(eventType)} size={size || 's'} />
      </Tooltip>
    );
  }
);
