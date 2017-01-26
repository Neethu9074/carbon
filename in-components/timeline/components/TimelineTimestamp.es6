import React from 'react';

import {openTimeSelector} from 'in-components/timeline/timelineStore';
import {formatDate, formatTime} from 'in-services/formatters/date';

import './TimelineTimestamp.less';


const block = 'in-timeline-timestamp';

export default function TimelineSelectedTime({timestamp, style, type = 'light', className}) {
  let classes = `${block} ${block}__${type}`;
  if (className) {
    classes += ` ${className}`;
  }

  return (
    <div className={classes}
         onClick={openTimeSelector}
         style={style}>
      <span className={block + '__date'}>
        {formatDate(timestamp)}
      </span>
      &nbsp;
      <span className={block + '__time'}>
        {formatTime(timestamp)}
      </span>
    </div>
  );
}
