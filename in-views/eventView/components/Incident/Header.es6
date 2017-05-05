import { combineLatest } from 'reactive-observables';
import React from 'react';

import { getEventType, EVENT_TYPES, fireCallbacksForEventAtFocusedMomentAsStream } from 'in-stores/events';
import EventDurationMarker from 'in-views/eventView/components/marker/EventDurationMarker';
import TriggeredMarker from 'in-views/eventView/components/marker/TriggeredMarker';
import { sortedRecentEvents$ } from 'in-views/eventView/stores/recentEventsStore';
import LabeledValue from 'in-components/TwoColumnView/components/LabeledValue';
import EndedMarker from 'in-views/eventView/components/marker/EndedMarker';
import Header from 'in-views/eventView/components/Header';
import connectTo from 'in-hoc/connectTo';

import './Header.less';

const block = 'in-event-view-incident-header';

export default connectTo(
  {
    recentEvents: sortedRecentEvents$,
    openEvents: sortedRecentEvents$.flatMap(_events =>
      combineLatest(
        _events.map(_event => fireCallbacksForEventAtFocusedMomentAsStream(_event, () => true, () => false))
      )
    )
  },
  function IncidentHeader({ event, recentEvents, openEvents }) {
    if (!recentEvents) {
      return null;
    }

    const changes = recentEvents.filter(e => getEventType(e) === EVENT_TYPES.CHANGE);
    const numOpenEvents = openEvents ? openEvents.filter(e => e).length : '';
    const affectedEnties = {};
    recentEvents.forEach(e => (affectedEnties[e.getIn(['problem', 'snapshotId'])] = true));
    const affectedServices = {};
    recentEvents.forEach(e => {
      const affectedServiceId = e.get('affectedService');
      if (affectedServiceId) {
        affectedServices[affectedServiceId] = true;
      }
    });

    return (
      <Header heading="Incident" event={event}>
        <div className={`${block}__status-line`}>
          <TriggeredMarker event={event} />
          <EndedMarker event={event} />
          <EventDurationMarker event={event} />
          <LabeledValue label="active">
            {`${numOpenEvents}/${recentEvents.length}`}
          </LabeledValue>

          <LabeledValue label="changes">
            {`${changes.length}`}
          </LabeledValue>

          <LabeledValue label="affected entities">
            {`${Object.keys(affectedEnties).length}`}
          </LabeledValue>
        </div>
      </Header>
    );
  }
);
