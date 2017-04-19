import React from 'react';

import { getEventType, getIconTypeForEventType } from 'in-services/issueTracker';
import SvgIcon from 'in-components/SvgIcon';

export default function EventIcon({ event, className, size = 16, useAlternativeChangeIcon = true }) {
  const eventType = getEventType(event);
  const iconType = getIconTypeForEventType(eventType, useAlternativeChangeIcon);

  return <SvgIcon className={className} type={iconType} width={size} height={size} color="#40535b" />;
}
