import React from 'react';

import {selectedEvent$} from 'in-components/eventView/stores/selectedEventStore';
import {getEventType, EVENT_TYPES} from 'in-services/issueTracker';
import EventIcon from 'in-components/EventIcon/EventIcon';
import connectTo from 'in-hoc/connectTo';

import './EventIconLabel.less';


const block = 'in-event-view-icon-label';

export default connectTo({
  event: selectedEvent$
},
function HeaderSwitch({event}) {
  if (!event) {
    return null;
  }

  const type = getEventType(event);
  return (
    <div className={block}>
      <EventIcon className={`${block}__icon`}
                 event={event}
                 defaultColor='#fff' />

      <span className={`${block}__title`}>
        {type === EVENT_TYPES.INCIDENT
          ? `Incident (${event.get('recentEvents').size})`
          : `Event`
        }
      </span>
    </div>
  );
});
