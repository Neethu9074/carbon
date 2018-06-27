import React from 'react';

import getApplicationEntityHealthInfo from 'in-subscription/application/getApplicationEntityHealthInfo';
import OpenIssuesListPresenter from 'in-new-components/health/OpenIssuesListPresenter';
import { getEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import { indeterminateProgress } from 'in-services/fixedObjects';
import { timeConfig$ } from 'in-stores/time/config';
import { mapData } from 'in-services/util/result';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ applicationId, serviceId, endpointId }) => ({
    openIssuesResult: timeConfig$
      .flatMap(timeConfig =>
        getApplicationEntityHealthInfo({
          applicationId,
          serviceId,
          endpointId,
          timeConfig
        })
      )
      .startWith(indeterminateProgress)
      .map(result => mapData(result, data => data.openIssues))
  }),
  function ApplicationEntityOpenIssuesList({ openIssuesResult, applicationId, serviceId, endpointId, eventId }) {
    return (
      <OpenIssuesListPresenter
        openIssuesResult={openIssuesResult}
        analyzeLink$={getEventsViewFilteredBy({
          applicationId,
          serviceId,
          endpointId,
          eventId
        })}
        getIssueLink={eventId =>
          getEventsViewFilteredBy({
            applicationId,
            serviceId,
            endpointId,
            eventId
          })
        }
      />
    );
  }
);
