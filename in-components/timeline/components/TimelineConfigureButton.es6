import React from 'react';

import {toggleShowTimeSelector, showTimeSelector$} from 'in-components/timeline/timelineStore';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import './TimelineConfigureButton.less';


const block = 'in-timeline-configure-button';

export default connectTo({
  showTimeSelector: showTimeSelector$,
},
function TimelineConfigureButton({showTimeSelector}) {
  return (
    <div className={`${block}` + (showTimeSelector ? ` ${block}--selected` : '')}
         onClick={toggleShowTimeSelector}>
      <SvgIcon className={`${block}__gear`}
               type='gear'
               color='#80939c'
               width={13} />
      Configure
    </div>
  );
});
