import React from 'react';

import TextInput from 'in-components/timeline/components/DatePicker/v2/TextInput';
import connectTo from 'in-hoc/connectTo';

import './DateTimeBlock.less';


const block = 'in-timeline-date-time-picker-date-time-block';

export default connectTo(props => {
  return {
    dateString: props.store.dateString$,
    timeString: props.store.timeString$,
  };
},
function DateTimeBlock({store, heading, dateString, timeString, showInputDescriptions}) {
  return (
    <div className={block}>
      <span className={`${block}__heading`}>
        {heading}
      </span>
      <div className={`${block}__inputs`}>
        <TextInput heading='Date'
                   value={dateString}
                   onChange={store.setDateString}
                   showInputDescriptions={showInputDescriptions}
                   isValid$={store.isDateTimeValid$.map(valid => valid.date)} />
        <TextInput heading='Time'
                   value={timeString}
                   onChange={store.setTimeString}
                   showInputDescriptions={showInputDescriptions}
                   isValid$={store.isDateTimeValid$.map(valid => valid.time)} />
      </div>
    </div>
  );
});
