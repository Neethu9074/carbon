import React from 'react';

import EventIconLabel from 'in-components/eventView/components/eventDetails/EventIconLabel';
import {selectedEvent$} from 'in-components/eventView/stores/selectedEventStore';
import {clearEvent} from 'in-services/issueTracker';
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
      <EventIconLabel event={event} />
      <div className={`${block}__icon`}
           onClick={() => clearEvent(event)}>
        <SvgIcon type='x'
                 width={6}
                 height={6}
                 color='#172429' />
      </div>
    </div>
  );
});
