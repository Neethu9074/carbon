/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import getApplicationEntityHealthInfo from 'in-subscription/application/getApplicationEntityHealthInfo';
import OpenIssuesListPresenter from 'in-components/health/OpenIssuesListPresenter';
import { getEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import { indeterminateProgress } from 'in-services/fixedObjects';
import { mapData } from 'in-services/util/result';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ applicationId, serviceId, endpointId, timeConfig }) => {
    return {
      openIssuesResult: getApplicationEntityHealthInfo({
        applicationId,
        serviceId,
        endpointId,
        timeConfig
      })
        .startWith(indeterminateProgress)
        .map(result => mapData(result, data => data.openIssues))
    };
  },
  function ApplicationEntityOpenIssuesList({
    openIssuesResult,
    resolvedEndpointId,
    applicationId,
    serviceId,
    endpointId,
    eventId,
    close
  }) {
    return (
      <OpenIssuesListPresenter
        close={close}
        openIssuesResult={openIssuesResult}
        analyzeLink$={getEventsViewFilteredBy({
          applicationId,
          serviceId,
          endpointId,
          resolvedEndpointId,
          eventId,
          eventTypeFilter: 'issue'
        })}
        getIssueLink={eventId =>
          getEventsViewFilteredBy({
            applicationId,
            serviceId,
            endpointId,
            resolvedEndpointId,
            eventId,
            eventTypeFilter: 'issue'
          })
        }
      />
    );
  }
);
