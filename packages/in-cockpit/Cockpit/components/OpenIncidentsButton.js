import React from 'react';

import HealthIndicatorButtonPresenter from 'in-new-components/health/HealthIndicatorButtonPresenter';
import { getEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import { openEventsAtServerTime$ } from 'in-stores/events';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';
import { hours } from 'in-services/time';

export default connectTo(
  {
    openEventsAtServerTime: openEventsAtServerTime$
  },
  function OpenIssueButton({ openEventsAtServerTime }) {
    const numIncidents = openEventsAtServerTime ? openEventsAtServerTime.get('incidentCount') : 0;
    const maxSeverity = openEventsAtServerTime ? openEventsAtServerTime.get('maxIncidentSeverity') : 0;

    return (
      <HealthIndicatorButtonPresenter
        showCheckAsNeutral
        openIssues={`${numIncidents} Incident${numIncidents === 1 ? '' : 's'}`}
        maxSeverity={maxSeverity}
        href$={timeConfig$.flatMap(timeConfig =>
          getEventsViewFilteredBy({
            eventTypeFilter: 'incident',
            timeConfig: timeConfig.to
              ? {
                  to: null,
                  windowSize: hours.toMillis(1),
                  focusedMoment: null
                }
              : timeConfig
          })
        )}
      />
    );
  }
);
