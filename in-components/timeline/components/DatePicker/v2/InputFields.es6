import React from 'react';

import {focusInput, clearFocusedInput} from 'in-components/timeline/components/DatePicker/stores/focusedDateInput';
import TextInput from 'in-components/timeline/components/DatePicker/v2/TextInput';

import './InputFields.less';


const block = 'in-timeline-date-time-picker-input-fields';

export default function InputFields() {
  return (
    <div className={block}>
      <DateTimeBlock heading='From' />
      <DateTimeBlock heading='To' />
    </div>
  );
}

function DateTimeBlock({heading}) {
  return (
    <div className={`${block}__date-time-block`}>
      <span className={`${block}__heading`}>
        {heading}
      </span>
      <div className={`${block}__inputs`}>
        <TextInput heading='Date'
                   value='ds'
                   onChange={text => console.log(text)}
                   onFocus={() => onFocus(heading)}
                   onBlur={clearFocusedInput} />
        <TextInput heading='Time'
                   value='ts'
                   onChange={text => console.log(text)}
                   onBlur={clearFocusedInput} />
      </div>
    </div>
  );
}

function onFocus(id) {
  focusInput(id);
}
