import { combineLatest, just } from 'reactive-observables';
import React from 'react';

import HealthIndicatorButtonPresenter from 'in-new-components/health/HealthIndicatorButtonPresenter';
import OpenIssuesListPresenter from 'in-new-components/health/OpenIssuesListPresenter';
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
            openIssues={`${numIncidents} Incidents`}
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
    <OpenIssuesListPresenter openIssuesResult={createEventResult([])} close={close} />
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
        return combineLatest(result.data.items.map(({ id }) => getEvent(id).map(event => event.toJS())));
      })
    )
  },
  function ContentWithEventsRetrieval({ events }) {
    return <OpenIssuesListPresenter openIssuesResult={createEventResult(events)} />;
  }
);

function createEventResult(events) {
  return !events
    ? pendingResult
    : {
        data: events,
        progress: { loading: false },
        errors: []
      };
}
