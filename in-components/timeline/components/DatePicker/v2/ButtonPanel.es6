import {combineLatest} from 'reactive-observables';
import React from 'react';

import {isDateTimeValid$ as focusedMomentValid$} from 'in-components/timeline/components/DatePicker/stores/focusedMomentDatePickerStore';
import {isDateTimeValid$ as fromValid$} from 'in-components/timeline/components/DatePicker/stores/fromDatePickerStore';
import {isDateTimeValid$ as toValid$} from 'in-components/timeline/components/DatePicker/stores/toDatePickerStore';
import {live$, setLive} from 'in-components/timeline/components/DatePicker/stores/liveStore';
import {toggleShowTimeSelector} from 'in-components/timeline/timelineStore';
import Toggle from 'in-components/form/Toggle';
import SvgIcon from 'in-components/SvgIcon';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import './ButtonPanel.less';


const block = 'in-timeline-date-time-picker-button-panel';

export default connectTo({
  live: live$
},
function ButtonPanel({live}) {
  return (
    <div className={`${block} ${block}__flex`}>
      <div className={`${block}__live-button`}>
        Live
        <Toggle className={`${block}__checkbox`}
                id='toggle_datepicker_live'
                checked={live}
                onChange={e => setLive(e.target.checked)} />
      </div>
      <div className={`${block}__flex`}>
        <ApplyButton live={live} />
        <SvgIcon className={`${block}__icon-button`}
                 type='x'
                 width={10}
                 color='#fff'
                 onClick={toggleShowTimeSelector} />
      </div>
    </div>
  );
});

const ApplyButton = connectTo({
  isValid: combineLatest([
    focusedMomentValid$,
    fromValid$,
    toValid$
  ])
  .throttle(100)
  .map(([focusedMomentValid, fromValid, toValid]) => {
    return focusedMomentValid.date &&
           focusedMomentValid.time &&
           fromValid.date &&
           fromValid.time &&
           toValid.date &&
           toValid.time;
  })
},
function ApplyButton({live, isValid}) {
  const isDisabled = ((!live && isValid) || live) ? false : true;
  return (
    <Button onClick={onApplyClicked}
            size='sm'
            disabled={isDisabled}>
      Apply
    </Button>
  );
});

function onApplyClicked() {
  console.log('apply');
}
