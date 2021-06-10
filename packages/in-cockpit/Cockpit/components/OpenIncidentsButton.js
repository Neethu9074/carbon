/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import HealthIndicatorButtonPresenter from 'in-components/health/HealthIndicatorButtonPresenter';
import { getEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import { openEventsAtServerTime$ } from 'in-stores/events';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';
import { hours } from 'in-services/time';
import { t } from 'in-i18n';

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
        openIssues={t('in-cockpit:component.openIncidentsButton.numberOfIncidents', { count: numIncidents })}
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
