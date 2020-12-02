import { combineLatest } from 'reactive-observables';
import React from 'react';

import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import EventListItem from 'in-events/components/legacy/EventListItem';
import { emptyList } from 'in-services/fixedImmutables';
import { getEvent } from 'in-stores/events';
import Card from 'in-new-components/Card';
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
      return (
        <Card title="Events">
          <LoadingIndicator />;
        </Card>
      );
    }

    const triggeringProblemId = incident.getIn(['problem', 'id']);

    return (
      <Card title={`Events (${events.length})`}>
        <div className={block}>
          <List events={events} triggeringProblemId={triggeringProblemId} />
        </div>
      </Card>
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
