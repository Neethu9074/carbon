import React from 'react';

import {toggleShowTimeSelector} from 'in-components/timeline/timelineStore';
import SvgIcon from 'in-components/SvgIcon';

import './ButtonPanel.less';


const block = 'in-timeline-date-time-picker-button-panel';

export default function ButtonPanel() {
  return (
    <div className={block}>
      <div>
        Reset
      </div>
      <div className={block}>
        Apply
        <SvgIcon className={`${block}__icon-button`}
                 type='x'
                 width={10}
                 color='#fff'
                 onClick={toggleShowTimeSelector} />
      </div>
    </div>
  );
}
