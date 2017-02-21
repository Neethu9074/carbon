import React from 'react';

import * as focusedMomentDatePickerStore from 'in-components/timeline/components/DatePicker/stores/focusedMomentDatePickerStore';
import TimelineTimestamp from 'in-components/timeline/components/TimelineTimestamp';
import {focusedMomentXPosition$} from 'in-components/timeline/timelineStore';
import {focusedMoment$} from 'in-components/timeline/timelineStore';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import './TimelineFocusedMoment.less';


const block = 'in-timeline-focused-moment';
const left = 5;
const right = -125;

export default connectTo({
  focusedMomentXPosition: focusedMomentXPosition$,
  focusedMoment: focusedMoment$,
},
function TimelineFocusedMoment({focusedMoment, focusedMomentXPosition, width}) {
  if (focusedMomentXPosition < 0) {
    return (
      <div className={`${block}__fixed-marker`}
           style={{ left: 0 }}>
        <SvgIcon type='arrow_left'
                 width={12}
                 height={12}
                 color='#9fffff' />
        <TimelineTimestamp timestamp={focusedMoment}
                           dateStore={focusedMomentDatePickerStore}
                           style={{
                             left: 15
                           }} />
      </div>
    );
  }

  if (focusedMomentXPosition > width) {
    return (
      <div className={`${block}__fixed-marker`}
           style={{ left: width }}>
        <TimelineTimestamp timestamp={focusedMoment}
                           dateStore={focusedMomentDatePickerStore}
                           style={{
                             left: right + 3
                           }} />
        <SvgIcon type='arrow_right'
                 width={12}
                 height={12}
                 color='#9fffff' />
      </div>
    );
  }

  return (
    <div className={block}
         style={{
           left: focusedMomentXPosition
         }}>
      <TimelineTimestamp timestamp={focusedMoment}
                         dateStore={focusedMomentDatePickerStore}
                         style={{
                           left: (focusedMomentXPosition > width / 2) ? right : left
                         }} />
      <div className={`${block}__marker`} />
    </div>
  );
});
