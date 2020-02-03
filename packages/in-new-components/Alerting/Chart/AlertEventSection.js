import React from 'react';

import { formatDateTime } from 'in-services/formatters/date';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';

import locals from './AlertEventSection.mless';

export default function AlertEventSection({ event }) {
  if (!event || !event.start) {
    return null;
  }

  return (
    <div className={locals.section}>
      <span className={locals.heading}>
        <time className={locals.time} dateTime={new Date(event.start).toISOString()}>
          {formatDateTime(event.start)}
        </time>
      </span>
      <div className={locals.content}>
        <SvgIcon className={locals.tooltipIcon} type="lib_events_warning" />
        <span className={locals.name}>{`${event.numberAlerts} Alert${event.numberAlerts > 1 ? 's' : ''}`} </span>
      </div>
    </div>
  );
}
