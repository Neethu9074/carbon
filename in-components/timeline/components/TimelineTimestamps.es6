import React from 'react';

import {setDateString as setFromDateString} from 'in-components/timeline/components/DatePicker/stores/fromDatePickerStore';
import {setDateString as setToDateString} from 'in-components/timeline/components/DatePicker/stores/toDatePickerStore';
import TimelineFocusedMoment from 'in-components/timeline/components/TimelineFocusedMoment';
import TimelineTimestamp from 'in-components/timeline/components/TimelineTimestamp';
import {to$, from$} from 'in-components/timeline/timelineStore';
import getElementDimensions from 'in-hoc/getElementDimensions';
import connectTo from 'in-hoc/connectTo';

import './TimelineTimestamps.less';


const block = 'in-timeline-timestamps';

export default getElementDimensions(connectTo({
  from: from$,
  to: to$
},
function TimelineMenu({from ,to, width}) {
  return (
    <div className={block}>
      <div className={`${block}__line ${block}__first`}>
        <TimelineFocusedMoment width={width} />
      </div>
      <div className={`${block}__line ${block}__second`}>
        <TimelineTimestamp timestamp={from}
                           type='dark'
                           dateFn={setFromDateString}
                           style={{
                             left: 0
                           }} />
        <TimelineTimestamp timestamp={to}
                           type='dark'
                           dateFn={setToDateString}
                           style={{
                             right: 0
                           }} />
      </div>
    </div>
  );
}));
