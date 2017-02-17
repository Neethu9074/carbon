import React from 'react';

import {toggleDateStore, currentDateStore$} from 'in-components/timeline/components/DatePicker/stores/currentDateStore';
import TextInput from 'in-components/timeline/components/DatePicker/TextInput';
import {evaluateClassNames} from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import './DateInput.less';


const block = 'in-date-picker-date-input';

export default connectTo({
  currentDateStore: currentDateStore$,
},
function DateInput({isValid$, heading, value, onChange, showInputDescriptions, currentDateStore, setDateStore}) {
  return (
    <div className={block}>
      <TextInput heading={heading}
                 value={value}
                 onChange={onChange}
                 showInputDescriptions={showInputDescriptions}
                 isValid$={isValid$} />
      <div className={evaluateClassNames({
             [`${block}__calendar`]: true,
             [`${block}--selected`]: currentDateStore === setDateStore
           })}
           onClick={() => onCalendarClicked(setDateStore)}>
        <SvgIcon className={`${block}__calendar-icon`}
                 type='calendar'
                 width={16}
                 color='#6B8088' />
      </div>
    </div>
  );
});

function onCalendarClicked(fn) {
  toggleDateStore(fn);
}
