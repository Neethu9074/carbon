import React from 'react';

import { getEventType, getIconTypeForEventType } from 'in-services/issueTracker';
import { getColorForEventAtFocusedMomentAsStream } from 'in-stores/events';
import { always } from 'in-services/fixedStreams';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    const defaultColor = props.defaultColor ? props.defaultColor : '#6B8088';
    return {
      color: props.color ? always(props.color) : getColorForEventAtFocusedMomentAsStream(props.event, defaultColor)
    };
  },
  function EventIcon({ event, className, color, size = 16, useAlternativeChangeIcon = true }) {
    const eventType = getEventType(event);
    const iconType = getIconTypeForEventType(eventType, useAlternativeChangeIcon);

    return <SvgIcon className={className} type={iconType} width={size} height={size} color={color} />;
  }
);
