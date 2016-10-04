import React from 'react';

import {getEventType, EVENT_TYPES} from 'in-services/issueTracker';
import EventIcon from 'in-components/EventIcon/EventIcon';

import './EventIconLabel.less';


const block = 'in-event-view-icon-label';

export default function HeaderSwitch({event}) {
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
}
