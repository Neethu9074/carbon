import React from 'react';

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
  return (
    <div className={block}
         style={{
           left: focusedMomentXPosition
         }}>
      <TimelineTimestamp timestamp={focusedMoment}
                         style={{
                           left: (focusedMomentXPosition > width / 2) ? -115 : 7
                         }} />
    </div>
  );
});
