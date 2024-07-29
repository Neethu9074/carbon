/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { just } from '@instana/observables';

import HealthIndicatorButtonPresenter from 'in-components/health/HealthIndicatorButtonPresenter';
import { useGetEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import { openEventsAtServerTime$ } from 'in-stores/events';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';
import { hours } from 'in-services/time';

export default connectTo(
  {
    openEventsAtServerTime: openEventsAtServerTime$
  },
  function OpenIssueButton({ openEventsAtServerTime }) {
    const { getEventsViewFilteredBy } = useGetEventsViewFilteredBy();
    const numIncidents = openEventsAtServerTime ? openEventsAtServerTime.get('incidentCount') : 0;
    const maxSeverity = openEventsAtServerTime ? openEventsAtServerTime.get('maxIncidentSeverity') : 0;

    return (
      <HealthIndicatorButtonPresenter
        openIncidents={numIncidents}
        maxSeverity={maxSeverity}
        href$={timeConfig$.flatMap(timeConfig =>
          just(
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
          )
        )}
        showCheckAsNeutral
      />
    );
  }
);
