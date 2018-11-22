import React from 'react';

import getApplicationEntityHealthInfo from 'in-subscription/application/getApplicationEntityHealthInfo';
import OpenIssuesListPresenter from 'in-new-components/health/OpenIssuesListPresenter';
import { getEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import { indeterminateProgress } from 'in-services/fixedObjects';
import { mapData } from 'in-services/util/result';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ clusterId, namespaceId, deploymentId, podId, nodeId, timeConfig }) => {
    return {
      openIssuesResult: getApplicationEntityHealthInfo({
        clusterId,
        namespaceId,
        deploymentId,
        podId,
        nodeId,
        timeConfig
      })
        .startWith(indeterminateProgress)
        .map(result => mapData(result, data => data.openIssues))
    };
  },
  function ApplicationEntityOpenIssuesList({
    openIssuesResult,
    resolvedEndpointId,
    clusterId,
    namespaceId,
    deploymentId,
    podId,
    nodeId,
    close
  }) {
    return (
      <OpenIssuesListPresenter
        close={close}
        openIssuesResult={openIssuesResult}
        getIssueLink={eventId =>
          getEventsViewFilteredBy({
            clusterId,
            namespaceId,
            deploymentId,
            podId,
            nodeId,
            resolvedEndpointId,
            eventId,
            eventTypeFilter: 'issue'
          })
        }
      />
    );
  }
);
