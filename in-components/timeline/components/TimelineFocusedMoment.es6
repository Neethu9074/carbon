import React from 'react';

import {setDateString} from 'in-components/timeline/components/DatePicker/stores/focusedMomentDatePickerStore';
import TimelineTimestamp from 'in-components/timeline/components/TimelineTimestamp';
import {focusedMomentXPosition$} from 'in-components/timeline/timelineStore';
import {focusedMoment$} from 'in-components/timeline/timelineStore';
import connectTo from 'in-hoc/connectTo';

import './TimelineFocusedMoment.less';


const block = 'in-timeline-focused-moment';

export default connectTo({
  focusedMomentXPosition: focusedMomentXPosition$,
  focusedMoment: focusedMoment$,
},
function TimelineFocusedMoment({focusedMoment, focusedMomentXPosition, width}) {
  if (focusedMomentXPosition < 0) {
    return null;
  }

  return (
    <div className={block}
         style={{
           left: focusedMomentXPosition
         }}>
      <TimelineTimestamp timestamp={focusedMoment}
                         dateFn={setDateString}
                         style={{
                           left: (focusedMomentXPosition > width / 2) ? -120 : 7
                         }} />
      <div className={`${block}__marker`} />
    </div>
  );
});
