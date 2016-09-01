import React from 'react';

import {getEventType, EVENT_TYPES} from 'in-services/issueTracker';
import SvgIcon from 'in-components/SvgIcon';
import {theme} from 'in-services/theme';


export default function EventIcon({event, className}) {
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

  const severity = event.get('severity');
  const color = (severity > 0  && event.get('state') === 'open')
    ? theme.health[Math.floor(severity)]
    : '#6B8088';

  return (
    <SvgIcon className={className}
             type={iconType}
             width={20}
             height={20}
             color={color} />
  );
}
