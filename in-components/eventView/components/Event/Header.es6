import React from 'react';

import AffectedServiceMarker from 'in-components/eventView/components/AffectedServiceMarker';
import StartedMarker from 'in-components/eventView/components/Incident/StartedMarker';
import EntityInformation from 'in-components/eventView/components/EntityInformation';
import EventDuration from 'in-components/eventView/components/EventDuration';
import {getColorForEventAtFocusedMomentAsStream} from 'in-stores/events';
import EventIcon from 'in-components/EventIcon';
import connectTo from 'in-hoc/connectTo';

import './Header.less';


const block = 'in-event-view-event-header';

export default connectTo(props => {
  return {
    color: getColorForEventAtFocusedMomentAsStream(props.event, '#6B8088')
  };
},
function EventHeader({event, color}) {
  const hasServiceImpact = event.get('affectedService');

  return (
    <div className={block}>
      <div className={`${block}__icon-wrapper`}
           style={{ background: color }}>
        <EventIcon event={event}
                   color='#fff' />
      </div>
      <div>
        <h1 className={`${block}__title`}>
          {event.getIn(['problem', 'problemText'])}
        </h1>
        <EntityInformation event={event} />

        <div className={`${block}__status-line`}>
          {hasServiceImpact
            ? <AffectedServiceMarker className={`${block}__affected-service-marker`} />
            : null
          }
          <StartedMarker event={event} />
          <EventDuration event={event} />
        </div>
      </div>
    </div>
  );
});
