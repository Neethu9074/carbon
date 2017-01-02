import React from 'react';

import EventDurationMarker from 'in-views/eventView/components/marker/EventDurationMarker';
import StartedMarker from 'in-views/eventView/components/marker/StartedMarker';
import EndedMarker from 'in-views/eventView/components/marker/EndedMarker';
import {getColorForEventAtFocusedMomentAsStream} from 'in-stores/events';
import EntityInformation from 'in-components/EntityInformation';
import Marker from 'in-views/eventView/components/Marker';
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
  return (
    <div className={block}>
      <div className={`${block}__icon-wrapper`}
           style={{ background: color }}>
        <EventIcon event={event}
                   color='#fff' />
      </div>
      <div className={`${block}__right`}>
        <h1 className={`${block}__title`}>
          {event.getIn(['problem', 'problemText'])}
        </h1>
        <EntityInformation snapshotId={event.getIn(['problem', 'snapshotId'])}
                           time={event.get('start')} />

        <div className={`${block}__status-line`}>
          <Marker className={`${block}__affected-service-marker`}
                  label='service impact'
                  event={event} />
          <StartedMarker event={event} />
          <EndedMarker event={event} />
          <EventDurationMarker event={event} />
        </div>
      </div>
    </div>
  );
});
