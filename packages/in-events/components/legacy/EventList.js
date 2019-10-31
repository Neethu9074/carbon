import { combineLatest } from 'reactive-observables';
import React from 'react';

import EventListItem from 'in-events/components/legacy/EventListItem';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { emptyList } from 'in-services/fixedImmutables';
import { getEvent } from 'in-stores/events';
import connectTo from 'in-hoc/connectTo';

import 'in-events/components/legacy/EventList.less';

const block = 'in-event-view-incident-event-list';

export default connectTo(
  ({ incident }) => ({
    events: combineLatest(
      incident
        .get('recentEvents', emptyList)
        .toArray()
        .map(getEvent)
    )
      .map(events =>
        events
          .filter(e => e && !e.isEmpty())
          .sort(
            (a, b) =>
              incident.getIn(['issueOrderMap', a.get('id')], a.get('start')) -
              incident.getIn(['issueOrderMap', b.get('id')], b.get('start'))
          )
      )
      .throttle(250)
  }),
  function IncidentEventList({ events, incident }) {
    if (!events) {
      return <LoadingIndicator type="dark" />;
    }

    const triggeringProblemId = incident.getIn(['problem', 'id']);

    return (
      <div className={block}>
        <div className={`${block}__counter`}>{`Events (${events.length})`}</div>
        <List events={events} triggeringProblemId={triggeringProblemId} />
      </div>
    );
  }
);

function List({ events, triggeringProblemId }) {
  return (
    <div className={`${block}__timeline`}>
      {events.map(_event => (
        <EventListItem key={_event.get('id')} triggeringProblemId={triggeringProblemId} event={_event} />
      ))}
    </div>
  );
}
