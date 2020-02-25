import { combineLatest, just } from 'reactive-observables';
import React from 'react';

import HealthIndicatorButtonPresenter from 'in-new-components/health/HealthIndicatorButtonPresenter';
import OpenIssuesListPresenter from 'in-new-components/health/OpenIssuesListPresenter';
import { getEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import { isEventOpenAtFocusedMoment } from 'in-stores/events';
import { getResultForData } from 'in-services/util/result';
import { openEventsAtServerTime$ } from 'in-stores/events';
import Overlay from 'in-new-components/overlays/Overlay';
import { pendingResult } from 'in-services/fixedObjects';
import getRawEvents from 'in-subscription/getRawEvents';
import { timeConfig$ } from 'in-stores/time/config';
import { getEvent } from 'in-stores/events';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    openEventsAtServerTime: openEventsAtServerTime$
  },
  function OpenIssueButton({ openEventsAtServerTime }) {
    const numIncidents = openEventsAtServerTime ? openEventsAtServerTime.get('incidentCount') : 0;
    const maxSeverity = openEventsAtServerTime ? openEventsAtServerTime.get('maxIncidentSeverity') : 0;

    return (
      <Overlay props={{ numIncidents, close }} content={Content} withoutWrapper>
        {({ toggle, refSetter }) => (
          <HealthIndicatorButtonPresenter
            openIssues={`${numIncidents} Incident${numIncidents === 1 ? '' : 's'}`}
            maxSeverity={maxSeverity}
            onClick={toggle}
            refSetter={refSetter}
          />
        )}
      </Overlay>
    );
  }
);

function Content({ numIncidents, close }) {
  return numIncidents === 0 ? (
    <OpenIssuesListPresenter
      eventType="Incident"
      openIssuesResult={createEventResult([])}
      close={close}
      analyzeLink$={getEventsViewFilteredBy({
        eventTypeFilter: 'incident'
      })}
    />
  ) : (
    <ContentWithEventsRetrieval close={close} />
  );
}

const ContentWithEventsRetrieval = connectTo(
  {
    events: timeConfig$.flatMap(timeConfig =>
      getRawEvents({
        timeConfig,
        query: 'event.type:incident',
        pagination: {
          cursor: null,
          retrievalSize: 10
        },
        order: {
          by: 'start',
          direction: 'DESC'
        }
      }).flatMap(result => {
        if (!result || !result.data) {
          return just(result);
        }
        return combineLatest(
          result.data.items
            .filter(({ start, end, state }) => isEventOpenAtFocusedMoment(start, end, state, timeConfig))
            .map(rawEvent => getEvent(rawEvent.id).map(event => event.toJS()))
        );
      })
    )
  },
  function ContentWithEventsRetrieval({ events }) {
    return (
      <OpenIssuesListPresenter
        eventType="Incident"
        openIssuesResult={createEventResult(events)}
        close={close}
        getIssueLink={eventId =>
          getEventsViewFilteredBy({
            eventId,
            eventTypeFilter: 'incident'
          })
        }
      />
    );
  }
);

function createEventResult(events) {
  return !events ? pendingResult : getResultForData(events);
}
