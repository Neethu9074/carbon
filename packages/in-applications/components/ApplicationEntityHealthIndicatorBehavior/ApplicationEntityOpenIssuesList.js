/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import getApplicationEntityHealthInfo from 'in-applications/subscriptions/getApplicationEntityHealthInfo';
import { useGetEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import OpenIssuesListPresenter from 'in-components/health/OpenIssuesListPresenter';
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
    inContentArea,
    openIssuesResult,
    resolvedEndpointId,
    applicationId,
    serviceId,
    endpointId,
    eventId,
    close
  }) {
    const additionalDFQFilter = getAdditionalFilters({ applicationId, serviceId, endpointId });

    // A simple solution to avoid some parts of the popup area hidden when too wide.
    // This workaround tackles it, until
    // a fix will have been implemented which solves the layout problem on other areas, too
    // Planned to be tackled in a bigger scope as part of this task:
    // https://instana.kanbanize.com/ctrl_board/37/cards/73986/details/
    function WithMaxWidthWhenInContentArea({ children, maxWidth = '80vw' }) {
      if (inContentArea) return <div style={{ maxWidth }}>{children}</div>;
      return <>{children}</>;
    }

    const { getEventsViewFilteredBy } = useGetEventsViewFilteredBy();

    function useIssueLink(eventId) {
      return getEventsViewFilteredBy({
        applicationId,
        serviceId,
        endpointId,
        resolvedEndpointId,
        eventId,
        eventTypeFilter: 'issue',
        additionalDFQFilter
      });
    }

    return (
      <WithMaxWidthWhenInContentArea>
        <OpenIssuesListPresenter
          close={close}
          openIssuesResult={openIssuesResult}
          analyzeLink={getEventsViewFilteredBy({
            applicationId,
            serviceId,
            endpointId,
            resolvedEndpointId,
            eventId,
            eventTypeFilter: 'issue',
            additionalDFQFilter
          })}
          getIssueLink={useIssueLink}
        />
      </WithMaxWidthWhenInContentArea>
    );
  }
);

function getAdditionalFilters({ applicationId, serviceId, endpointId }) {
  // There is a bug currently which lead to all events are hidden in the event view.
  // A user wouldn't be able then to investigate further because there is no event to click on.
  // Till that is solved, we disable this filter.
  // const dfq = `event.state:open`;
  const dfq = '';

  if ((applicationId, serviceId, endpointId)) {
    return `entity.selfType:endpoint ${dfq}`;
  }

  if ((applicationId, serviceId)) {
    return `entity.selfType:service ${dfq}`;
  }

  if (applicationId) {
    return `entity.selfType:application ${dfq}`;
  }

  return dfq;
}
