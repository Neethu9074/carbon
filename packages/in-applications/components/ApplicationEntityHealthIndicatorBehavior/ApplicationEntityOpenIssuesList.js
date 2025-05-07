/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import getApplicationEntityHealthInfo from 'in-applications/subscriptions/getApplicationEntityHealthInfo';
import { useGetEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import OpenIssuesListPresenter from 'in-components/health/OpenIssuesListPresenter';
import { pendingResult } from 'in-services/fixedObjects';
import { mapData } from 'in-services/util/result';

export default function ApplicationEntityOpenIssuesList({
  inContentArea,
  resolvedEndpointId,
  applicationId,
  serviceId,
  endpointId,
  eventId,
  close,
  timeConfig
}) {
  const openIssuesResult =
    useObservable(
      getApplicationEntityHealthInfo({
        applicationId,
        serviceId,
        endpointId,
        timeConfig
      }).map(result => mapData(result, data => data.openIssues)),
      [(applicationId, serviceId, endpointId, timeConfig)]
    ) ?? pendingResult;

  const additionalDFQFilter = `event.state:open`;

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
