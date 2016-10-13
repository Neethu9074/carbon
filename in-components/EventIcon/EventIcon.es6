import React from 'react';

import {getColorForEventAtFocusedMomentAsStream} from 'in-stores/events';
import {getEventType, EVENT_TYPES} from 'in-services/issueTracker';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';


export default connectTo(props => {
  const defaultColor = props.defaultColor ? props.defaultColor : '#6B8088';
  return {
    color: getColorForEventAtFocusedMomentAsStream(props.event, defaultColor)
  };
},
function EventIcon({event, className, color}) {
  const eventType = getEventType(event);

  let iconType;
  if (eventType === EVENT_TYPES.INCIDENT) {
    iconType = 'incidents';
  } else if (eventType === EVENT_TYPES.CHANGE) {
    iconType = 'change2';
  } else if (eventType === EVENT_TYPES.ISSUE_WARNING) {
    iconType = 'warning';
  } else {
    iconType = 'critical';
  }

  return (
    <SvgIcon className={className}
             type={iconType}
             width={16}
             height={16}
             color={color} />
  );
});
