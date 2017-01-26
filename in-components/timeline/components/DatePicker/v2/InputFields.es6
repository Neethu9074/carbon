import React from 'react';

import * as focusedMomentStore from 'in-components/timeline/components/DatePicker/stores/focusedMomentDatePickerStore';
import * as windowSizeStore from 'in-components/timeline/components/DatePicker/stores/windowSizeStore';
import * as fromStore from 'in-components/timeline/components/DatePicker/stores/fromDatePickerStore';
import * as toStore from 'in-components/timeline/components/DatePicker/stores/toDatePickerStore';
import {live$} from 'in-components/timeline/components/DatePicker/stores/liveStore';
import TextInput from 'in-components/timeline/components/DatePicker/v2/TextInput';
import SelectBox from 'in-components/timeline/components/DatePicker/v2/SelectBox';
import {slices} from 'in-components/timeline/timelineConfig';
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
                 values={slices}
                 value={windowSize}
                 onChange={val => windowSizeStore.setWindowSize(Number(val))} />
    </div>
  );
});

function FixedTimestampInputFields() {
  return (
    <div className={block}>
      <DateTimeBlock heading='From'
                     store={fromStore} />

      <DateTimeBlock heading='To'
                     store={toStore} />

      <div className={`${block}__separator`} />

      <DateTimeBlock heading='Selected moment'
                     store={focusedMomentStore} />
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
function DateTimeBlock({store, heading, dateString, timeString}) {
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
                   onChange={store.setDateString} />
        <TextInput heading='Time'
                   value={timeString}
                   onChange={store.setTimeString} />
      </div>
    </div>
  );
});
