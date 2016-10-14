import React from 'react';

import {getColorForEventAtFocusedMomentAsStream} from 'in-stores/events';
import {getEventType, EVENT_TYPES} from 'in-services/issueTracker';
import {always} from 'in-services/fixedStreams';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';


export default connectTo(props => {
  const defaultColor = props.defaultColor ? props.defaultColor : '#6B8088';
  return {
    color: props.color
      ? always(props.color)
      : getColorForEventAtFocusedMomentAsStream(props.event, defaultColor)
  };
},
function EventIcon({event, className, color, size = 16, useAlternativeChangeIcon = true}) {
  const eventType = getEventType(event);

  let iconType;
  if (eventType === EVENT_TYPES.INCIDENT) {
    iconType = 'incidents';
  } else if (eventType === EVENT_TYPES.CHANGE) {
    iconType = useAlternativeChangeIcon ? 'change2' : 'change';
  } else if (eventType === EVENT_TYPES.ISSUE_WARNING) {
    iconType = 'warning';
  } else {
    iconType = 'critical';
  }

  return (
    <SvgIcon className={className}
             type={iconType}
             width={size}
             height={size}
             color={color} />
  );
});
