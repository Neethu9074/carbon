import React from 'react';

import getKubernetesEntityHealthInfo from 'in-subscription/kubernetes/getKubernetesEntityHealthInfo';
import OpenIssuesListPresenter from 'in-new-components/health/OpenIssuesListPresenter';
import { getEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import { indeterminateProgress } from 'in-services/fixedObjects';
import { mapData } from 'in-services/util/result';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ clusterId, namespaceId, deploymentId, podId, nodeId, timeConfig }) => {
    return {
      openIssuesResult: getKubernetesEntityHealthInfo({
        filter: {
          clusterId,
          namespaceId,
          deploymentId,
          podId,
          nodeId,
          timeConfig
        }
      })
        .startWith(indeterminateProgress)
        .map(result => mapData(result, data => data.openIssues))
    };
  },
  function KubernetesEntityOpenIssuesList({
    openIssuesResult,
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
        analyzeLink$={getEventsViewFilteredBy({
          clusterId,
          namespaceId,
          deploymentId,
          podId,
          nodeId,
          eventTypeFilter: 'issue'
        })}
        getIssueLink={eventId =>
          getEventsViewFilteredBy({
            clusterId,
            namespaceId,
            deploymentId,
            podId,
            nodeId,
            eventId,
            eventTypeFilter: 'issue'
          })
        }
      />
    );
  }
);
