import React from 'react';

import * as focusedMomentStore from 'in-components/timeline/components/DatePicker/stores/focusedMomentDatePickerStore';
import {INPUTS, clearFocusedInput} from 'in-components/timeline/components/DatePicker/stores/focusedDateInput';
import * as fromStore from 'in-components/timeline/components/DatePicker/stores/fromDatePickerStore';
import * as toStore from 'in-components/timeline/components/DatePicker/stores/toDatePickerStore';
import {live$} from 'in-components/timeline/components/DatePicker/stores/liveStore';
import TextInput from 'in-components/timeline/components/DatePicker/v2/TextInput';
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

function LiveInputFields() {
  return (
    <div className={block}>
      WINDOWSIZE
    </div>
  );
}

function FixedTimestampInputFields() {
  return (
    <div className={block}>
      <DateTimeBlock heading='From'
                     store={fromStore}
                     inputIdToFocus={INPUTS.FROM} />

      <DateTimeBlock heading='To'
                     store={toStore}
                     inputIdToFocus={INPUTS.TO} />

      <div className={`${block}__separator`} />

      <DateTimeBlock heading='Selected moment'
                     store={focusedMomentStore}
                     inputIdToFocus={INPUTS.FOCUSED_MOMENT} />
    </div>
  );
}

const DateTimeBlock = connectTo(props => {
  if (!props.store) {
    return {};
  }
  return {
    dateString: props.store.dateString$,
    timeString: props.store.timeString$,
  };
},
function DateTimeBlock({store, heading, inputIdToFocus, dateString, timeString}) {
  if (!store) {
    return null;
  }
  return (
    <div className={`${block}__date-time-block`}>
      <span className={`${block}__heading`}>
        {heading}
      </span>
      <div className={`${block}__inputs`}>
        <TextInput heading='Date'
                   value={dateString}
                   onChange={store.setDateString}
                   inputIdToFocus={inputIdToFocus}
                   onBlur={clearFocusedInput} />
        <TextInput heading='Time'
                   value={timeString}
                   onChange={store.setTimeString}
                   onBlur={clearFocusedInput} />
      </div>
    </div>
  );
});
