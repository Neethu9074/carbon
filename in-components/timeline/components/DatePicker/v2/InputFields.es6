import React from 'react';

import * as focusedMomentStore from 'in-components/timeline/components/DatePicker/stores/focusedMomentDatePickerStore';
import * as windowSizeStore from 'in-components/timeline/components/DatePicker/stores/windowSizeStore';
import * as fromStore from 'in-components/timeline/components/DatePicker/stores/fromDatePickerStore';
import * as toStore from 'in-components/timeline/components/DatePicker/stores/toDatePickerStore';
import DateTimeBlock from 'in-components/timeline/components/DatePicker/v2/DateTimeBlock';
import {live$} from 'in-components/timeline/components/DatePicker/stores/liveStore';
import SelectBox from 'in-components/timeline/components/DatePicker/v2/SelectBox';
import connectTo from 'in-hoc/connectTo';

import './InputFields.less';


const block = 'in-timeline-date-time-picker-input-fields';

export default connectTo({
  live: live$
},
function InputFields({live}) {
  return (
    live
      ? <LiveInputFields />
      : <FixedTimestampInputFields />
  );
});

const LiveInputFields = connectTo({
  windowSize: windowSizeStore.windowSize$
},
function LiveInputFields({windowSize}) {
  return (
    <div className={block}>
      <SelectBox heading='Windowsize'
                 value={windowSize}
                 onChange={windowSizeStore.setWindowSize} />
    </div>
  );
});

function FixedTimestampInputFields() {
  return (
    <div className={block}>
      <DateTimeBlock heading='From'
                     store={fromStore}
                     showInputDescriptions />

      <DateTimeBlock heading='To'
                     store={toStore} />

      <div className={`${block}__separator`} />

      <DateTimeBlock heading='Selected moment'
                     store={focusedMomentStore} />
    </div>
  );
}
