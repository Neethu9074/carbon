import React from 'react';

import getApplicationEntityHealthInfo from 'in-subscription/application/getApplicationEntityHealthInfo';
import OpenIssuesListPresenter from 'in-new-components/health/OpenIssuesListPresenter';
import { getEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import { indeterminateProgress } from 'in-services/fixedObjects';
import { mapData } from 'in-services/util/result';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ applicationId, serviceId, endpointId, endpointType, timeConfig }) => {
    const endpointHealthId = serviceId + '<|>' + endpointId + '<|>' + endpointType;
    return {
      openIssuesResult: getApplicationEntityHealthInfo({
        applicationId,
        serviceId,
        endpointId: endpointHealthId,
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
    endpointType,
    eventId,
    close
  }) {
    let endpointHealthId;
    if (serviceId && endpointId && endpointType) {
      endpointHealthId = serviceId + '<|>' + endpointId + '<|>' + endpointType;
    }
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
            endpointId: endpointHealthId,
            eventId,
            eventTypeFilter: 'issue'
          })
        }
      />
    );
  }
);
