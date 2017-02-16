import React from 'react';

import {toggleRight} from 'in-views/eventView/stores/expandedSide';
import {selectedEvent$} from 'in-stores/events';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import './EventDetailHeader.less';


const block = 'in-event-view-event-detail-header';

export default connectTo({
  event: selectedEvent$
},
function EventDetailHeader({event}) {
  if (!event) {
    return null;
  }

  return (
    <div className={block}>
      <SvgIcon type='fullscreen'
               onClick={toggleRight}
               height={14}
               className={`${block}__toggle-right`} />
    </div>
  );
});
