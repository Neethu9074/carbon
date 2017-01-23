import React from 'react';

import {focusInput} from 'in-components/timeline/components/DatePicker/stores/focusedDateInput';
import {openTimeSelector} from 'in-components/timeline/timelineStore';
import {formatDate, formatTime} from 'in-services/formatters/date';

import './TimelineTimestamp.less';


const block = 'in-timeline-timestamp';

export default function TimelineSelectedTime({timestamp, style, type = 'light', inputIdToFocus}) {
  const className = `${block} ${block}__${type}`;

  return (
    <div className={className}
         onClick={() => {
           openTimeSelector();
           focusInput(inputIdToFocus);
         }}
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
