import React from 'react';

import DatePickerApplyButton from 'in-components/timeline/components/DatePicker/DatePickerApplyButton';
import {live$, setLive} from 'in-components/timeline/components/DatePicker/stores/liveStore';
import {toggleShowTimeSelector} from 'in-components/timeline/timelineStore';
import Toggle from 'in-components/form/Toggle';
import SvgIcon from 'in-components/SvgIcon';
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
        <DatePickerApplyButton live={live} />
        <SvgIcon className={`${block}__icon-button`}
                 type='x'
                 width={10}
                 color='#fff'
                 onClick={toggleShowTimeSelector} />
      </div>
    </div>
  );
});
