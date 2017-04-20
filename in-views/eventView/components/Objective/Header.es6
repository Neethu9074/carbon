import { combineLatest } from 'reactive-observables';
import React from 'react';

import EventDurationMarker from 'in-views/eventView/components/marker/EventDurationMarker';
import { sortedRecentEvents$ } from 'in-views/eventView/stores/recentEventsStore';
import StartedMarker from 'in-views/eventView/components/marker/StartedMarker';
import LabeledValue from 'in-components/TwoColumnView/components/LabeledValue';
import { fireCallbacksForEventAtFocusedMomentAsStream } from 'in-stores/events';
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

    const numOpenEvents = openEvents ? openEvents.filter(e => e).length : '';
    const affectedEnties = {};
    recentEvents.forEach(e => affectedEnties[e.getIn(['problem', 'snapshotId'])] = true);
    const affectedServices = {};
    recentEvents.forEach(e => {
      const affectedServiceId = e.get('affectedService');
      if (affectedServiceId) {
        affectedServices[affectedServiceId] = true;
      }
    });

    return (
      <Header heading="Objective violation" event={event}>
        <div className={`${block}__status-line`}>
          <StartedMarker event={event} />
          <EndedMarker event={event} />
          <EventDurationMarker event={event} />
          <LabeledValue label="active">
            {`${numOpenEvents}/${recentEvents.length}`}
          </LabeledValue>

          <LabeledValue label="affected entities">
            {`${Object.keys(affectedEnties).length}`}
          </LabeledValue>
        </div>
      </Header>
    );
  }
);
