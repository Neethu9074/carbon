import {combineLatest} from 'reactive-observables';
import React from 'react';

import StartedMarker from 'in-components/eventView/components/Incident/StartedMarker';
import {sortedRecentEvents$} from 'in-components/eventView/stores/recentEventsStore';
import LabeledValue from 'in-components/TwoColumnView/components/LabeledValue';
import {fireCallbacksForEventAtFocusedMomentAsStream} from 'in-stores/events';
import EventDuration from 'in-components/eventView/components/EventDuration';
import {getColorForEventAtFocusedMomentAsStream} from 'in-stores/events';
import {getEventType, EVENT_TYPES} from 'in-services/issueTracker';
import EventIcon from 'in-components/EventIcon';
import connectTo from 'in-hoc/connectTo';

import './Header.less';


const block = 'in-event-view-incident-header';

export default connectTo(props => {
  return {
    recentEvents: sortedRecentEvents$,
    openEvents: sortedRecentEvents$.flatMap(_events => combineLatest(
      _events.map(_event => fireCallbacksForEventAtFocusedMomentAsStream(_event, () => true, () => false))
    )),
    color: getColorForEventAtFocusedMomentAsStream(props.event, '#6B8088')
  };
},
function IncidentHeader({event, recentEvents, openEvents, color}) {
  if (!recentEvents) {
    return null;
  }

  const changes = recentEvents.filter(e => getEventType(e) === EVENT_TYPES.CHANGE);
  const numOpenEvents = openEvents ? openEvents.filter(e => e).length : '';
  const affectedEnties = {};
  recentEvents.forEach(e => affectedEnties[e.getIn(['problem', 'snapshotId'])] = true);

  return (
    <div className={block}>
      <div className={`${block}__icon-wrapper`}
           style={{ background: color }}>
        <EventIcon event={event}
                   color='#fff' />
      </div>

      <div>
        <h1 className={`${block}__title`}>
          Incident
        </h1>

        <StartedMarker event={event} />
        <EventDuration event={event} />

        <LabeledValue label='active' >
          {`${numOpenEvents}/${recentEvents.length}`}
        </LabeledValue>

        <LabeledValue label='changes' >
          {`${changes.length}`}
        </LabeledValue>

        <LabeledValue label='affected entities' >
          {`${Object.keys(affectedEnties).length}`}
        </LabeledValue>
      </div>
    </div>
  );
});
