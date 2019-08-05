import React from 'react';

import { getEventType, getIconTypeForEventType } from 'in-stores/events';
import SvgIcon from 'in-components/SvgIcon';

export default function EventIcon({ event, className, size = 'xs', useAlternativeChangeIcon = true }) {
  const eventType = getEventType(event);
  const iconType = getIconTypeForEventType(eventType, useAlternativeChangeIcon);

  return <SvgIcon className={className} type={iconType} size={size} color="#40535b" />;
}
