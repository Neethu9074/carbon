import React from 'react';

import ButtonPanel from 'in-components/timeline/components/DatePicker/v2/ButtonPanel';
import InputFields from 'in-components/timeline/components/DatePicker/v2/InputFields';
import DatePicker from 'in-components/timeline/components/DatePicker/v2/DatePicker';
import InfoPanel from 'in-components/timeline/components/DatePicker/v2/InfoPanel';
import {interactableTimelineHeight$} from 'in-components/timeline/timelineStore';
import connectTo from 'in-hoc/connectTo';

import './DateTimePickerPopup.less';


const block = 'in-timeline-date-time-picker-popup';

export default connectTo({
  height: interactableTimelineHeight$
},
function DateTimePickerPopup({height}) {
  return (
    <div className={block}
         style={{
           bottom: `${height}px`
         }}>
      <ButtonPanel />
      <div className={`${block}__left`}>
        <InfoPanel />
        <InputFields />
      </div>
      <div className={`${block}__right`}>
        <DatePicker />
      </div>
    </div>
  );
});
