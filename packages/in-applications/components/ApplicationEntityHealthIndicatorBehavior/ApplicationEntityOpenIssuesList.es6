import React from 'react';

import getApplicationEntityHealthInfo from 'in-subscription/application/getApplicationEntityHealthInfo';
import OpenIssuesListPresenter from 'in-new-components/health/OpenIssuesListPresenter';
import { getEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import { indeterminateProgress } from 'in-services/fixedObjects';
import { mapData } from 'in-services/util/result';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ applicationId, serviceId, endpointHealthId, timeConfig }) => {
    return {
      openIssuesResult: getApplicationEntityHealthInfo({
        applicationId,
        serviceId,
        endpointHealthId,
        timeConfig
      })
        .startWith(indeterminateProgress)
        .map(result => mapData(result, data => data.openIssues))
    };
  },
  function ApplicationEntityOpenIssuesList({
    openIssuesResult,
    applicationId,
    serviceId,
    endpointId,
    endpointHealthId,
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
          eventId,
          eventTypeFilter: 'issue'
        })}
        getIssueLink={eventId =>
          getEventsViewFilteredBy({
            applicationId,
            serviceId,
            endpointId: endpointId ? endpointHealthId : undefined,
            eventId,
            eventTypeFilter: 'issue'
          })
        }
      />
    );
  }
);
